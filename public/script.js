// API Base URL
const API_URL = 'http://localhost:3000/api';

// Current user and token
let currentUser = null;
let token = localStorage.getItem('token');

// Check authentication on load
document.addEventListener('DOMContentLoaded', () => {
    if (token) {
        verifyToken();
    } else {
        showAuthPage();
    }
});

// Verify token and get current user
async function verifyToken() {
    try {
        const response = await fetch(`${API_URL}/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showFeed();
        } else {
            localStorage.removeItem('token');
            token = null;
            showAuthPage();
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        showAuthPage();
    }
}

// Show authentication page
function showAuthPage() {
    document.getElementById('navbar').style.display = 'none';
    document.getElementById('auth-page').style.display = 'block';
    document.getElementById('feed-page').style.display = 'none';
    document.getElementById('profile-page').style.display = 'none';
}

// Show feed page
function showFeed() {
    document.getElementById('navbar').style.display = 'block';
    document.getElementById('auth-page').style.display = 'none';
    document.getElementById('feed-page').style.display = 'block';
    document.getElementById('profile-page').style.display = 'none';
    loadPosts();
}

// Show profile page
function showProfile() {
    document.getElementById('navbar').style.display = 'block';
    document.getElementById('auth-page').style.display = 'none';
    document.getElementById('feed-page').style.display = 'none';
    document.getElementById('profile-page').style.display = 'block';
    loadUserProfile();
}

// Toggle between login and register
let isLoginMode = true;
function toggleAuth() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const usernameGroup = document.getElementById('username-group');
    const btn = document.getElementById('auth-btn');
    const switchText = document.getElementById('auth-switch-text');
    const switchLink = document.getElementById('auth-switch-link');

    if (isLoginMode) {
        title.textContent = 'Login';
        usernameGroup.style.display = 'none';
        btn.textContent = 'Login';
        switchText.textContent = "Don't have an account?";
        switchLink.textContent = 'Register';
    } else {
        title.textContent = 'Register';
        usernameGroup.style.display = 'block';
        btn.textContent = 'Register';
        switchText.textContent = 'Already have an account?';
        switchLink.textContent = 'Login';
    }
}

// Handle authentication form submission
document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const username = document.getElementById('username').value;

    const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
    const body = isLoginMode ? { email, password } : { username, email, password };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            token = data.token;
            currentUser = data.user;
            localStorage.setItem('token', token);
            showFeed();
        } else {
            alert(data.error || 'Authentication failed');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Logout
function logout() {
    localStorage.removeItem('token');
    token = null;
    currentUser = null;
    showAuthPage();
}

// Load posts for feed
async function loadPosts() {
    try {
        const response = await fetch(`${API_URL}/posts`);
        const data = await response.json();
        renderPosts(data.posts);
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Render posts
function renderPosts(posts) {
    const feed = document.getElementById('posts-feed');
    feed.innerHTML = '';

    posts.forEach(post => {
        const postElement = createPostElement(post);
        feed.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.id = `post-${post._id}`;

    const isLiked = post.likes.some(like => like._id === currentUser?._id);
    const userInitial = post.user.username ? post.user.username.charAt(0).toUpperCase() : 'U';
    const profilePic = post.user.profilePicture 
        ? `<img src="${post.user.profilePicture}" alt="${post.user.username}">`
        : userInitial;

    postDiv.innerHTML = `
        <div class="post-header">
            <div class="post-avatar">${profilePic}</div>
            <div class="post-user-info">
                <h4>${post.user.username}</h4>
                <span>${new Date(post.createdAt).toLocaleString()}</span>
            </div>
        </div>
        <div class="post-content">${post.content}</div>
        ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
        <div class="post-actions">
            <button class="post-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike('${post._id}')">
                ❤️ ${post.likesCount}
            </button>
            <button class="post-action-btn" onclick="toggleComments('${post._id}')">
                💬 ${post.commentsCount}
            </button>
        </div>
        <div class="comments-section" id="comments-${post._id}" style="display: none;">
            <div id="comments-list-${post._id}"></div>
            <div class="add-comment">
                <input type="text" id="comment-input-${post._id}" placeholder="Add a comment...">
                <button onclick="addComment('${post._id}')">Comment</button>
            </div>
        </div>
    `;

    return postDiv;
}

// Create post
async function createPost() {
    const content = document.getElementById('post-content').value;
    
    if (!content.trim()) {
        alert('Please enter some content');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ content })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('post-content').value = '';
            loadPosts();
        } else {
            alert(data.error || 'Failed to create post');
        }
    } catch (error) {
        console.error('Error creating post:', error);
        alert('An error occurred. Please try again.');
    }
}

// Toggle like on post
async function toggleLike(postId) {
    try {
        const response = await fetch(`${API_URL}/likes/${postId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            updatePostLikeUI(postId, data.post);
        } else {
            // If already liked, unlike
            const unlikeResponse = await fetch(`${API_URL}/likes/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (unlikeResponse.ok) {
                const data = await unlikeResponse.json();
                updatePostLikeUI(postId, data.post);
            }
        }
    } catch (error) {
        console.error('Error toggling like:', error);
    }
}

// Update post like UI
function updatePostLikeUI(postId, post) {
    const postElement = document.getElementById(`post-${postId}`);
    const likeBtn = postElement.querySelector('.post-action-btn');
    const isLiked = post.likes.some(like => like._id === currentUser._id);
    
    likeBtn.innerHTML = `❤️ ${post.likesCount}`;
    likeBtn.className = `post-action-btn ${isLiked ? 'liked' : ''}`;
}

// Toggle comments section
async function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    const commentsList = document.getElementById(`comments-list-${postId}`);
    
    if (commentsSection.style.display === 'none') {
        commentsSection.style.display = 'block';
        loadComments(postId);
    } else {
        commentsSection.style.display = 'none';
    }
}

// Load comments for a post
async function loadComments(postId) {
    try {
        const response = await fetch(`${API_URL}/comments/post/${postId}`);
        const data = await response.json();
        renderComments(postId, data.comments);
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Render comments
function renderComments(postId, comments) {
    const commentsList = document.getElementById(`comments-list-${postId}`);
    commentsList.innerHTML = '';

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        
        const userInitial = comment.user.username ? comment.user.username.charAt(0).toUpperCase() : 'U';
        const profilePic = comment.user.profilePicture 
            ? `<img src="${comment.user.profilePicture}" alt="${comment.user.username}">`
            : userInitial;

        commentDiv.innerHTML = `
            <div class="comment-header">
                <div class="comment-avatar">${profilePic}</div>
                <span class="comment-user">${comment.user.username}</span>
            </div>
            <p class="comment-text">${comment.text}</p>
        `;
        
        commentsList.appendChild(commentDiv);
    });
}

// Add comment to post
async function addComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const text = input.value;

    if (!text.trim()) {
        alert('Please enter a comment');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ post: postId, text })
        });

        const data = await response.json();

        if (response.ok) {
            input.value = '';
            loadComments(postId);
            loadPosts(); // Refresh to update comment count
        } else {
            alert(data.error || 'Failed to add comment');
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('An error occurred. Please try again.');
    }
}

// Load user profile
async function loadUserProfile() {
    try {
        const response = await fetch(`${API_URL}/users/profile/${currentUser._id}`);
        const data = await response.json();
        
        if (response.ok) {
            renderProfile(data.user);
            loadUserPosts(currentUser._id);
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Render profile
function renderProfile(user) {
    const userInitial = user.username ? user.username.charAt(0).toUpperCase() : 'U';
    const profilePic = user.profilePicture 
        ? `<img src="${user.profilePicture}" alt="${user.username}">`
        : userInitial;

    document.getElementById('profile-pic').innerHTML = profilePic;
    document.getElementById('profile-username').textContent = user.username;
    document.getElementById('profile-bio').textContent = user.bio || 'No bio yet';
    document.getElementById('posts-count').textContent = `${user.postsCount} posts`;
    document.getElementById('followers-count').textContent = `${user.followersCount} followers`;
    document.getElementById('following-count').textContent = `${user.followingCount} following`;
}

// Load user's posts
async function loadUserPosts(userId) {
    try {
        const response = await fetch(`${API_URL}/posts/user/${userId}`);
        const data = await response.json();
        renderUserPosts(data.posts);
    } catch (error) {
        console.error('Error loading user posts:', error);
    }
}

// Render user's posts
function renderUserPosts(posts) {
    const userPostsDiv = document.getElementById('user-posts');
    userPostsDiv.innerHTML = '';

    if (posts.length === 0) {
        userPostsDiv.innerHTML = '<p>No posts yet</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = createPostElement(post);
        userPostsDiv.appendChild(postElement);
    });
}

// Show edit profile modal
function showEditProfile() {
    document.getElementById('edit-bio').value = currentUser.bio || '';
    document.getElementById('edit-profile-pic').value = currentUser.profilePicture || '';
    document.getElementById('edit-profile-modal').style.display = 'flex';
}

// Hide edit profile modal
function hideEditProfile() {
    document.getElementById('edit-profile-modal').style.display = 'none';
}

// Handle edit profile form submission
document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const bio = document.getElementById('edit-bio').value;
    const profilePicture = document.getElementById('edit-profile-pic').value;

    try {
        const response = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ bio, profilePicture })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            hideEditProfile();
            loadUserProfile();
        } else {
            alert(data.error || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred. Please try again.');
    }
});
