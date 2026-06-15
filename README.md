# Mini Social Media Platform

A full-stack social media application built with Express.js (Node.js), MongoDB, HTML, CSS, and JavaScript.

## Features

- **User Authentication**: Register, login, logout with JWT authentication
- **User Profiles**: Profile pictures, bio, followers/following counts
- **Posts**: Create, read, update, delete posts with text content
- **Comments**: Add comments to posts with real-time updates
- **Likes**: Like and unlike posts with live counters
- **Follow System**: Follow and unfollow users
- **Responsive Design**: Mobile-friendly interface with modern UI

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure

```
minisocialMedia/
├── models/
│   ├── User.js          # User model with password hashing
│   ├── Post.js          # Post model with likes and comments
│   ├── Comment.js       # Comment model
│   └── Follow.js        # Follow relationship model
├── routes/
│   ├── auth.js          # Authentication routes (register, login)
│   ├── users.js         # User profile routes
│   ├── posts.js         # Post CRUD operations
│   ├── comments.js      # Comment operations
│   ├── likes.js         # Like/unlike functionality
│   └── follows.js       # Follow/unfollow functionality
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── public/
│   ├── index.html       # Main HTML file
│   ├── styles.css       # Styling
│   └── script.js        # Frontend JavaScript
├── server.js            # Main server file
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (installed and running)
- npm or yarn

## Installation

1. **Clone the repository or navigate to the project directory**
   ```bash
   cd minisocialMedia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   The `.env` file is already created with default values. Update if needed:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/minisocialmedia
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   ```bash
   # On Windows (if using MongoDB as a service)
   net start MongoDB

   # Or start MongoDB manually
   mongod
   ```

5. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Posts
- `POST /api/posts` - Create a post
- `GET /api/posts` - Get all posts (feed)
- `GET /api/posts/user/:userId` - Get user's posts
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `POST /api/comments` - Add comment to post
- `GET /api/comments/post/:postId` - Get comments for post
- `DELETE /api/comments/:id` - Delete comment

### Likes
- `POST /api/likes/:postId` - Like a post
- `DELETE /api/likes/:postId` - Unlike a post

### Follows
- `POST /api/follows/:userId` - Follow a user
- `DELETE /api/follows/:userId` - Unfollow a user
- `GET /api/follows/followers/:userId` - Get user's followers
- `GET /api/follows/following/:userId` - Get users followed by user

## Usage

### Registering a User
1. Open the application in your browser
2. Click "Register" on the login page
3. Enter username, email, and password
4. Click "Register" to create your account

### Creating a Post
1. Login to your account
2. On the feed page, type your post content in the text area
3. Click "Post" to publish

### Liking a Post
1. Click the heart icon on any post to like it
2. Click again to unlike

### Adding Comments
1. Click the comment icon on a post
2. Type your comment in the input field
3. Click "Comment" to submit

### Editing Profile
1. Navigate to your profile page
2. Click "Edit Profile"
3. Update your bio and profile picture URL
4. Click "Save" to update

## Database Schema

### User
- username (String, unique)
- email (String, unique)
- password (String, hashed)
- bio (String)
- profilePicture (String)
- followers (Array of User references)
- following (Array of User references)
- createdAt (Date)

### Post
- user (User reference)
- content (String)
- image (String)
- likes (Array of User references)
- likesCount (Number)
- comments (Array of Comment references)
- commentsCount (Number)
- createdAt (Date)

### Comment
- post (Post reference)
- user (User reference)
- text (String)
- createdAt (Date)

### Follow
- follower (User reference)
- following (User reference)
- createdAt (Date)

## Security Features

- Password hashing with bcryptjs
- JWT authentication for protected routes
- Input validation on server-side
- CORS enabled for cross-origin requests

## Future Enhancements

- Image upload support for posts and profile pictures
- Real-time notifications
- Search functionality
- Trending posts
- Admin panel
- Dark/light mode toggle
- Private messaging

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running on your system
- Check the MONGODB_URI in .env file
- Verify MongoDB is listening on the correct port

### Port Already in Use
- Change the PORT in .env file
- Or stop the process using port 3000

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET in .env file
- Verify token is being sent in headers

## License

This project is open source and available for educational purposes.

## Author

Built as a mini social media platform demonstration.
