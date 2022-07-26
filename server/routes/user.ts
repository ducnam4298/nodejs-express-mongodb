import express from 'express';
import { verifyToken } from '../../middleware/auth';
import User from '../models/user';
const router = express.Router();

router.get('/', verifyToken, async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json({ data: users });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/profile', verifyToken, async (req, res, next) => {
  const { userId } = req.body;
  console.log('userId', userId);
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(403).json({ message: 'User notfound' });
    res.status(200).json({ data: user, message: '' });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.status(200).json({ data: user });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export = router;
