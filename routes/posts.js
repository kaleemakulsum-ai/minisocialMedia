const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a post
router.post('/', auth, async (req, res) => {
  try {
    const { content, image } = req.body;
    const post = new Post({
      user: req.user._id,
      content,
      image
    });
    await post.save();
    await post.populate('user', 'username profilePicture');
    res.status(201).json({ post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all posts (feed)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username profilePicture')
      .populate('likes', 'username')
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's posts
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username profilePicture')
      .populate('likes', 'username')
      .sort({ createdAt: -1 });
    res.json({ posts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username profilePicture')
      .populate('likes', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username profilePicture' }
      });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { content, image } = req.body;
    if (content) post.content = content;
    if (image !== undefined) post.image = image;

    await post.save();
    await post.populate('user', 'username profilePicture');
    res.json({ post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
