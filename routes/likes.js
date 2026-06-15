const express = require('express');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Like a post
router.post('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ error: 'Already liked' });
    }

    post.likes.push(req.user._id);
    post.likesCount += 1;
    await post.save();
    await post.populate('user', 'username profilePicture');

    res.json({ post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unlike a post
router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ error: 'Not liked' });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    post.likesCount -= 1;
    await post.save();
    await post.populate('user', 'username profilePicture');

    res.json({ post });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
