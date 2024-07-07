let handTracker, video, handDetections;
let canvasImage; // Variable for the image
// Flag to check if freehand drawing mode is on
let freehandMode = false; 
// Flag for region selection mode
let regionSelectMode = false; 
// Array to store drawing coordinates
let sketchPath = [];
// Object to store selected area data
let selectedArea;
// Variable to store the snipped image area
let snippedImage;
// Array to store placed images and their positions
let placedImages = [];


// Global variables for pasting
let isPasting = false;
let pasteX, pasteY;

let loadingGif; // Variable for the loading gif
let modelIsReady = false; // Flag to check if the model is ready

/* Preload assets before setup 
 * Loads necessary media files, such as the loading GIF, before the rest of the program begins.
 */
function preload() {
  loadingGif = loadImage('media/load_screen.gif'); // Make sure the path is correct
}

/* Initialize canvas, image, video, and handTracker model 
 * Sets up the canvas, loads the image to be processed, initializes the video capture and the handTracker model. 
 * Also defines the size of the video and hides the default video element.
 */
function setup() {
    createCanvas(1250, 437); 
    canvasImage = loadImage('media/canton.jpg');

    video = createCapture(VIDEO);
    video.size(width / 2, height);
    video.hide();

    handTracker = ml5.handpose(video, signalModelReadiness);
    handTracker.on('hand', gotResults);
}

/* Confirm model readiness 
 * updates a flag when the handTracker model is ready, indicating that the program can start processing video input.
 */
function signalModelReadiness() {
    modelIsReady = true; 
}

/* Process new handTracker results 
 * Receives and stores the latest handTracker detection results for use in other parts of the program.
 */
function gotResults(results) {
    handDetections = results;
}

/* Main sketchPath loop for rendering visuals 
 * The central loop of the program. This function continuously updates the canvas. It handles the rendering of the background, image, and video. 
 * It also manages different modes like sketchPath, selection, and pasting, and calls other functions to draw keypoints and selections.
 */
function draw() {
  background(255);

    image(canvasImage, 0, 0, width / 2, height);
    
    if (!modelIsReady) {
      image(loadingGif, width / 2, 0, width / 2, height);
    } else {
      image(video, width / 2, 0, width / 2, height);
    }

    if (freehandMode && handDetections && handDetections.length > 0) {
        const indexTip = getFingerPosition(handDetections[0].landmarks, 8);
        if (indexTip) {
            sketchPath[sketchPath.length - 1].push({x: indexTip.x, y: indexTip.y});
        }
    }

    // Draw all the sketchPath paths
    stroke(255, 0, 255); // Magenta
    strokeWeight(2);
    noFill();
    for (let path of sketchPath) {
        beginShape();
        for (let point of path) {
            vertex(point.x, point.y);
        }
        endShape();
    }

    // If a region has been captured and pasting mode is active, draw it on the image
    if (isPasting && snippedImage) {
        image(snippedImage, pasteX, pasteY);
    }

    // Draw all the pasted images, saved all pastings
    for (let pastedImage of placedImages) {
      image(pastedImage.canvasImage, pastedImage.x, pastedImage.y);
  }

    // If selection mode, draw the bounding box and thumb ellipse
    if (regionSelectMode && handDetections && handDetections.length > 0) {
        createSelectionElements();
    }

    // Draw keypoints if detections are available
    if (handDetections && handDetections.length > 0) {
        illustrateKeypoints();
    }
}

/* Draw selection tools and display measurement 
 * Handles the drawing of selection-related visuals. This includes an ellipse at the thumb, a dotted line between thumb and index finger, 
 * and a bounding box around the selected area. It also calculates and displays the length of the line between the thumb and index finger.
 */
function createSelectionElements() {
  const thumbTip = getFingerPosition(handDetections[0].landmarks, 4);
  const indexTip = getFingerPosition(handDetections[0].landmarks, 8);

  // Draw the green ellipse for the thumb in selection mode
  if (thumbTip) {
      fill(0, 255, 0); // Green
      noStroke();
      ellipse(thumbTip.x + width / 2, thumbTip.y, 10, 10);
  }

  // Extra: Connect the thumb and index fingertips with a dotted line and display the length
  if (thumbTip && indexTip) {
      stroke(128, 128, 128); // Grey
      strokeWeight(2);
      dottedLine(thumbTip.x + width / 2, thumbTip.y, indexTip.x + width / 2, indexTip.y);
      
      // Calculate the length of the line
      const lineLength = dist(thumbTip.x, thumbTip.y, indexTip.x, indexTip.y);
      
      // Display the length next to the thumb position
      fill(0); // Black
      textSize(12);
      text(lineLength.toFixed(2) + " px", thumbTip.x + width / 2 + 15, thumbTip.y);

      // Draw bounding box on still image side
      stroke(128, 128, 128); // Grey
      noFill();

      const minX = min(thumbTip.x, indexTip.x);
      const minY = min(thumbTip.y, indexTip.y);
      const boxWidth = abs(indexTip.x - thumbTip.x);
      const boxHeight = abs(indexTip.y - thumbTip.y);

      // Draw the bounding box
      rect(minX, minY, boxWidth, boxHeight);
  }
}


/* Create dotted lines for visual representation 
 * A utility function to draw a dotted line between two points. It divides the line into specified segments 
 * and draws small lines for each segment to create the dotted effect.
 */
function dottedLine(x1, y1, x2, y2, segments = 10) {
  let distance = dist(x1, y1, x2, y2);
  let segmentLength = distance / segments;

  for (let i = 0; i < segments; i++) {
      let xStart = lerp(x1, x2, i / segments);
      let yStart = lerp(y1, y2, i / segments);
      let xEnd = lerp(x1, x2, (i + 0.5) / segments);
      let yEnd = lerp(y1, y2, (i + 0.5) / segments);
      line(xStart, yStart, xEnd, yEnd);
  }
}

/* Render keypoints from handpose detections 
 * Iterates through each detection from the handpose model and renders keypoints (like the index finger's position) on the canvas, 
 * both on the video feed and the still image.
 */
function illustrateKeypoints() {
  for (let i = 0; i < handDetections.length; i++) {
      const detection = handDetections[i];
      if (detection.landmarks) {
          const indexFinger = detection.landmarks[8];
          if (indexFinger) {
              // Get the position for the video feed
              const xVideo = indexFinger[0] + width / 2;
              const yVideo = indexFinger[1];

              // Use the same x-coordinate for the still image
              const xImage = indexFinger[0];
              const yImage = indexFinger[1];

              // Draw circle for index fingertip on the video feed
              fill(255, 0, 0); // Red
              noStroke();
              ellipse(xVideo, yVideo, 10, 10);

              // Draw circle for index fingertip on still canvasImage
              fill(0, 255, 0); // Green
              ellipse(xImage, yImage, 10, 10);
          }
      }
  }
}

/* Key press event handling 
 * Handles various key press events to toggle between different modes like sketchPath, selection, and pasting. 
 * It also manages the capturing and pasting of image regions based on the current mode and handTracker detections.
 */
function keyPressed() {
    if (key === 'f') {
        if (!freehandMode) {
          sketchPath.push([]); // Start a new sketchPath path
        }
        freehandMode = !freehandMode;
        regionSelectMode = false;
        isPasting = false;

    } else if (key === 's') {
        regionSelectMode = !regionSelectMode;
        freehandMode = false; 
        isPasting = false;

  } else if (key === 'c' && regionSelectMode && handDetections && handDetections.length > 0) {
    const thumbTip = getFingerPosition(handDetections[0].landmarks, 4);
    const indexTip = getFingerPosition(handDetections[0].landmarks, 8);
    if (thumbTip && indexTip) {
      selectedArea = {
        x: min(thumbTip.x, indexTip.x),
        y: min(thumbTip.y, indexTip.y),
        w: abs(indexTip.x - thumbTip.x),
        h: abs(indexTip.y - thumbTip.y)
      };
      snippedImage = canvasImage.get(selectedArea.x, selectedArea.y, selectedArea.w, selectedArea.h);
    }
  } else if (key === 'v' && regionSelectMode && snippedImage) {
    const thumbTip = getFingerPosition(handDetections[0].landmarks, 4);
    const indexTip = getFingerPosition(handDetections[0].landmarks, 8);
    if (thumbTip && indexTip) {
        const pasteX = min(thumbTip.x, indexTip.x);
        const pasteY = min(thumbTip.y, indexTip.y);

        // Store the captured image and its position
        placedImages.push({ canvasImage: snippedImage, x: pasteX, y: pasteY });
    }
  }else if (key === 'e') {
    // Reset the canvas
    sketchPath = []; // Clear all sketchPath paths
    placedImages = []; // Clear all pasted images
    snippedImage = null;
    selectedArea = null;
}
}

/* Calculate finger position in canvas coordinates 
 * A utility function that translates the finger position from the handTracker model's coordinates to the canvas coordinates. 
 * It is used to accurately render keypoints and selections on the canvas.
 */
function getFingerPosition(landmarks, fingerIndex) {
  if (landmarks && landmarks[fingerIndex]) {
      const fingerTip = landmarks[fingerIndex];
      return {
          x: map(fingerTip[0], 0, video.width, 0, width / 2),
          y: map(fingerTip[1], 0, video.height, 0, height)
      };
  }
  return null;
}
