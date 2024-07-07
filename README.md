# GestureRecognition-DrawingCanvas

## Preamble

This project was developed as part of the CS3483 - Multimodal Interface Design course during my exchange at the City University of Hong Kong in Winter 2023/24. The project showcases a web application that integrates hand tracking for interacting with a canvas element, enabling functionalities such as drawing, selecting regions, and manipulating images.

## Overview

GestureRecognition-DrawingCanvas is a web-based application that uses hand tracking to allow users to interact with a canvas. Users can draw, select regions, and manipulate images using hand gestures.

## Features

- **Drawing Function**: Switch to free drawing mode by pressing the 'f' key and draw on the canvas.
- **Selection and Copy Function**: Press the 's' key to switch to selection mode, draw a bounding box between your thumb and index finger, and copy the selected area with the 'c' key.
- **Paste Function**: Paste copied image sections onto the canvas by pressing the 'v' key.
- **Reset Function**: Reset the canvas to its initial state by pressing the 'e' key.

## Screen Captures

- **Initial Screen**: Displays a loading screen until the model is fully loaded.
- **Finger Tracking**: Tracks the user's index finger, projecting a red dot on the camera feedback and a green dot on the canvas.
- **Drawing Function**: Users can draw lines on the canvas by moving their finger.
- **Selection and Copy Function**: Users can select regions and copy them.
- **Paste Function**: Users can paste copied regions onto the canvas.
- **Reset Function**: Users can reset the canvas to its initial state.

## Limitations and Potential Future Improvements

- **User Feedback**: The program currently has limited user feedback, with occasional camera freezes during the initial load.
- **Gesture Recognition**: Gesture recognition accuracy can be improved further.
- **Additional Features**: Future versions could include more functionalities like multiple colors, erasers, color-fill tools, etc.
- **User Instructions**: Additional information texts or tutorials would help users learn how to use the program more effectively.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License. See the [LICENSE](LICENSE) file for details.

## Setup and Usage

1. **Clone the repository**:
    ```bash
    git clone https://github.com/QuirkyCroissant/GestureRecognition-DrawingCanvas
    cd GestureRecognition-DrawingCanvas
    ```

2. **Open the application**:
   - Open `index.html` in your preferred web browser.

3. **Ensure you have an active internet connection** to load the required libraries from the CDN.

4. **Ensure you have a working webcam** as the application uses it to track hand gestures.

## Acknowledgments

This project was developed as an individual assignment as part of the coursework for CS3483 - Multimodal Interface Design at CityU.
