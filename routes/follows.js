const express = require('express');
const User = require('../models/User');
const Follow = require('../models/Follow');
const auth = require('../middleware/auth');
const router = express.Router();

// Follow a user
router.post('/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    
    if (targetUserId === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.user._id,
      following: targetUserId
    });

    if (existingFollow) {
      return res.status(400).json({ error: 'Already following' });
    }

    // Create follow relationship
    const follow = new Follow({
      follower: req.user._id,
      following: targetUserId
    });
    await follow.save();

    // Update users' followers/following arrays
    await User.findByIdAndUpdate(req.user._id, {
      $push: { following: targetUserId }
    });
    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: req.user._id }
    });

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unfollow a user
router.delete('/:userId', auth, async (req, res) => {
  try {
    const targetUserId = req.params.userId;

    await Follow.findOneAndDelete({
      follower: req.user._id,
      following: targetUserId
    });

    // Update users' followers/following arrays
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { following: targetUserId }
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: req.user._id }
    });

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get followers of a user
router.get('/followers/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('followers', 'username profilePicture bio');
    res.json({ followers: user.followers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get following of a user
router.get('/following/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate('following', 'username profilePicture bio');
    res.json({ following: user.following });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
