const express = require('express');
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const auth = require('../middleware/auth');
const router = express.Router();

// Add comment to post
router.post('/', auth, async (req, res) => {
  try {
    const { post, text } = req.body;
    const comment = new Comment({
      post,
      user: req.user._id,
      text
    });
    await comment.save();
    await comment.populate('user', 'username profilePicture');

    // Update post's comments array and count
    const postDoc = await Post.findById(post);
    postDoc.comments.push(comment._id);
    postDoc.commentsCount += 1;
    await postDoc.save();

    res.status(201).json({ comment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get comments for a post
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json({ comments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Update post's comments count
    const postDoc = await Post.findById(comment.post);
    postDoc.commentsCount -= 1;
    postDoc.comments = postDoc.comments.filter(c => c.toString() !== comment._id.toString());
    await postDoc.save();

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
