import { hash, verify } from 'argon2';
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

const router = express.Router();

router.post('/signin', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password is required' });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const passwordValidate = await verify(user.password, password);
    if (!passwordValidate) return res.status(400).json({ message: 'Password incorrect' });
    const accessToken = jwt.sign({ userId: user._id }, 'abcabcabc123123123abcabc');
    res.status(200).json({ message: 'Signin successfully', accessToken });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'username already' });
    }
    const hashedPassword = await hash(password);
    const newUser = new User({
      username,
      password: hashedPassword
    });
    await newUser.save();
    const accessToken = process.env.ACCESS_TOKEN_SECRET && jwt.sign({ userId: newUser._id }, process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({ message: 'User created successfully', accessToken });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export = router;
