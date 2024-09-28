Clothing Product Size Recommendation App
This mobile app allows users to scan a clothing product QR code, input their parameters (height, sex, and morphology), take front and side pose photos, and receive a size recommendation. The app integrates Shopify's Skia library for UI rendering and uses Frank's API for product and recommendation services.

Features
📷 QR Code Scanning: Scan a product's QR code to retrieve relevant information from the shop.
📐 User Parameters Input: Users enter their height, sex, and body morphology for personalized size recommendations.
🖼️ Front and Side Photos: Capture front and side photos to improve the recommendation system's accuracy.
🔍 Product Lookup: Perform product lookups directly from the shop.
Libraries and Tools Used
Skia: UI rendering library provided by Shopify.
Frank's API (Welyne): Handles HTTP (REST API) methods for retrieving recommendations and performing product lookups.
Getting Started
Prerequisites
Ensure you have the following installed:

Android Studio or Xcode (for iOS)
A valid API key for Frank's API (Welyne)
Node.js (for package management)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/YourUsername/ClothingRecommendationApp.git
Install dependencies:

bash
Copy code
npm install
Add your API key:

bash
Copy code
export API_KEY='your-api-key-here'
Run the project:

bash
Copy code
npm start
Usage
Scan QR Code: Use the app's built-in QR code scanner to capture the product's code.
Input Parameters: Fill in the height, sex, and morphology details.
Take Photos: Capture your front and side photos.
Get Size Recommendation: The app provides a recommended size based on the input parameters and photos.
API Integration
The app integrates with Frank’s API to:

Retrieve size recommendations based on user input.
Fetch product details from the shop.
Example API request to retrieve product details:

bash
Copy code
curl -X GET "https://api.welyne.com/v1/product/{product-id}" \
     -H "Authorization: Bearer {API_KEY}"
Unfinished Tasks
 Integrate recommendation API: Complete the backend connection to Frank's API for live size recommendations.
 Improve camera functionality: Optimize front and side pose capturing for enhanced accuracy.
 Error handling for API calls: Implement better error handling for failed product lookups and size recommendations.
Contributing
We welcome contributions! Please fork the repository and submit a pull request for any changes or improvements.

Fork the project.
Create your feature branch (git checkout -b feature/your-feature-name).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/your-feature-name).
Open a pull request.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Contact
For any questions or support, feel free to reach out:

Email: dinari.malek1@gmail.com
LinkedIn: Malek Dinari
