import express from 'express';
import { verifyToken } from '../middleware/auth';
import Post, { PostStatus } from '../models/post';

const router = express.Router();

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const posts = await Post.find({ userId: req.body.userId }).populate('user', ['username']);
    res.json({ posts });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const post = await Post.findOne({ userId: req.body.userId, _id: req.params.id }).populate('user', ['username']);
    res.json({ post });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', verifyToken, async (req: any, res, next) => {
  const { title, description, url, status, user } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  if (!url) return res.status(400).json({ message: 'Url is required' });
  try {
    const newPost = new Post({
      title,
      description,
      url: url.startsWith('https://') ? url : `https://${url}`,
      status: status || PostStatus.TOLEARN,
      user
    });
    await newPost.save();
    res.status(200).json({ message: 'Post created successfully', post: newPost });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', verifyToken, async (req, res, next) => {
  const { title, description, url, status, user } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  if (!url) return res.status(400).json({ message: 'Url is required' });
  try {
    const updatePost = {
      title,
      description: description || '',
      url: url.startsWith('https://') ? url : `https://${url}`,
      status: status || PostStatus.TOLEARN
    };
    const postChecking = { _id: req.params.id, user };
    const updated = await Post.findOneAndUpdate(postChecking, updatePost, { new: true });
    if (!updated) return res.status(401).json({ message: 'Unauthorized' });
    res.status(200).json({ message: 'Post updated successfully', post: updated });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const postChecking = { _id: req.params.id, user: req.body.user };
    const deleted = await Post.findOneAndDelete(postChecking);
    if (!deleted) return res.status(401).json({ message: 'Unauthorized' });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export = router;
