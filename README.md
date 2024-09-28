# WeeFizz : A Clothing Size Recommendation App

This project is a mobile application that allows users to scan clothing product QR codes, take measurements through photos, and get size recommendations based on their body type. The app uses a combination of QR code scanning and user inputs (such as height, sex, and morphology) to generate personalized size suggestions.

## Features

- **Scan a clothing product QR code** with the camera to identify the product.
- **Input personal details** like height, sex, and morphology.
- **Take photos in front and side poses** for measurement processing.
- **Generate size recommendations** based on the user's body type and the specific clothing item.
- **View the product's size and fit information** in the app.
- **Integration with Frank’s API (Welyne)** to get size recommendation results.

## Unfinished Tasks

- [ ] Implement HTTP methods to interact with Frank's API for size recommendations.
- [ ] Complete the shop product lookup feature within the app.
- [ ] Improve user interface and input validation.
- [ ] Debug and optimize photo measurement processing.

## Requirements

- Mobile device with a camera
- Internet connection for API calls

## Tech Stack

- **Frontend:** React Native
- **Backend:** Node.js, Express
- **APIs:** Frank's API (Welyne)
- **Libraries:**
  - Skia (Shopify) for rendering and graphics processing
  - React Native Camera for QR code scanning
  - React Native Elements for UI components

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Malek-Dinari/WeeFizz.git
   cd WeeFizz
   
2. Install dependencies:
```bash
   npm install
```
Run on your device:
```bash

npx react-native run-android  # for Android
npx react-native run-ios      # for iOS
```

## Future Improvements

- Integration of Recommendation API: Full integration of Asma’s recommendation API to automate sizing.
- Shop Product Lookup: Direct product lookup from the shop inside the app using Welyne’s API.
- Optimize Camera and Pose Detection: Further improvements in pose detection accuracy for better size recommendations.

## Known Issues

CMake Debug Errors: Issues with the fast-tflite library when switching between branches. If you encounter issues, a rebuild from a fresh clone may resolve them.

## Contribution

I'm no longer actively working on this project due to other commitments, but feel free to fork the repository and submit pull requests.

For any inquiries, feel free to reach out to me at:

- Email: dinari.malek1@gmail.com
- LinkedIn: [Malek Dinari](https://www.linkedin.com/in/malek-dinari-99b431263/)
  
## License

This project is licensed under the MIT License.
