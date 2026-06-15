# Mini Social Media Platform

A full-stack social media application built with Express.js (Node.js), MongoDB, HTML, CSS, and JavaScript.

## Features

* User Authentication: Register, login, logout with JWT authentication
* User Profiles: Profile pictures, bio, followers/following counts
* Posts: Create, read, update, delete posts with text content
* Comments: Add comments to posts with real-time updates
* Likes: Like and unlike posts with live counters
* Follow System: Follow and unfollow users
* Responsive Design: Mobile-friendly interface with modern UI

## Tech Stack

* Backend: Node.js, Express.js
* Database: MongoDB with Mongoose
* Frontend: HTML, CSS, JavaScript (Vanilla)
* Authentication: JWT (JSON Web Tokens)
* Password Hashing: bcryptjs

## Prerequisites

* Node.js (v14 or higher)
* MongoDB (installed and running)
* npm or yarn

## Installation

1. Navigate to the project directory:

   ```bash
   cd minisocialMedia
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/minisocialmedia
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start MongoDB.

5. Start the server:

   ```bash
   npm start
   ```

   Development mode:

   ```bash
   npm run dev
   ```

6. Open:

   ```
   http://localhost:3000
   ```

## API Endpoints

### Authentication

* POST /api/auth/register
* POST /api/auth/login

### Users

* GET /api/users/me
* GET /api/users/profile/:id
* PUT /api/users/profile

### Posts

* POST /api/posts
* GET /api/posts
* GET /api/posts/user/:userId
* GET /api/posts/:id
* PUT /api/posts/:id
* DELETE /api/posts/:id

### Comments

* POST /api/comments
* GET /api/comments/post/:postId
* DELETE /api/comments/:id

### Likes

* POST /api/likes/:postId
* DELETE /api/likes/:postId

### Follows

* POST /api/follows/:userId
* DELETE /api/follows/:userId
* GET /api/follows/followers/:userId
* GET /api/follows/following/:userId

## Security Features

* Password hashing with bcryptjs
* JWT authentication
* Input validation
* CORS enabled

## Future Enhancements

* Image upload support
* Real-time notifications
* Search functionality
* Trending posts
* Admin panel
* Dark/Light mode
* Private messaging

## License

This project is open source and available for educational purposes.

## Author
kulsum
Built as a Mini Social Media Platform demonstration.
github repository:https://github.com/kaleemakulsum-ai/minisocialMedia

