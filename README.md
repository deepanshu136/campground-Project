Campground Project
Overview
This project is a web application designed to allow users to browse, add, edit, and delete campground listings. It provides a platform for users to discover and share their favorite camping spots with others.

Features
User Authentication: Users can sign up, log in, and log out securely to access the application's features.
Campground Listings: Users can view a list of all campgrounds available in the system, including details such as name, description, and images.
Campground Details: Users can click on individual campgrounds to view more detailed information, including location, amenities, and reviews.
Add/Edit/Delete Campgrounds: Authenticated users can add new campgrounds, edit existing campgrounds, and delete campgrounds they have added.
Reviews and Ratings: Users can leave reviews and ratings for campgrounds, providing valuable feedback for other users.
Image Upload: Users can upload images for their campgrounds to enhance their listings.
Responsive Design: The application is designed to be mobile-friendly and accessible on devices of all sizes.
Integration with Cloudinary: Campground images are stored and served using Cloudinary for seamless image upload and management.
Map Integration with Mapbox GL: Campground locations are displayed using interactive maps powered by Mapbox GL.
Technologies Used
Frontend: HTML, CSS, JavaScript (with frameworks such as Bootstrap)
Backend: Node.js, Express.js
Database: MongoDB (with Mongoose ODM)
Authentication: Passport.js
Image Storage: Cloudinary
Maps: Mapbox GL
Deployment: Heroku (optional)
Setup Instructions
Clone the repository: git clone <repository-url>
Navigate to the project directory: cd campground-project
Install dependencies: npm install
Set up environment variables:
Create a .env file in the root directory
Define environment variables such as DATABASE_URL, SECRET_KEY, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, MAPBOX_ACCESS_TOKEN, etc.
Start the server: npm start
Access the application in your web browser at http://localhost:3000
