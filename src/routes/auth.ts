import { hash, verify } from 'argon2';
import express from 'express';
import jwt from 'jsonwebtoken';
import MUser from '../models/user';
import MToken from '../models/token';
import dotenv from '../config/dotenv';
import { verifyToken } from '../middleware/auth';

dotenv();

const router = express.Router();

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password is required' });
  }
  try {
    const user = await MUser.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const passwordValidate = await verify(user.password, password);
    if (!passwordValidate) return res.status(400).json({ message: 'Password incorrect' });
    const token = generateToken({ userId: user._id });
    if (!token) return res.status(400).json({ message: 'Signin failed' });
    const newToken = new MToken({
      accessToken: token?.accessToken,
      refreshToken: token?.refreshToken,
      user: user._id
    });
    await newToken.save();
    res.status(200).json({ message: 'Signin successfully', token });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', verifyToken, async (req, res, next) => {
  const { userId } = req.body;
  try {
    const tokenChecking = { user: userId };
    await MToken.deleteMany(tokenChecking);
    res.status(204).json({ message: 'Signout successfully' });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing username or password' });
  try {
    const user = await MUser.findOne({ username });
    if (user) return res.status(400).json({ message: 'username already' });
    const hashedPassword = await hash(password);
    const newUser = new MUser({
      username,
      password: hashedPassword
    });
    const token = generateToken({ userId: newUser._id });
    if (!token) return res.status(400).json({ message: `Signup failed` });

    const newToken = new MToken({
      accessToken: token?.accessToken,
      refreshToken: token?.refreshToken,
      user: newUser._id
    });
    await newToken.save();
    await newUser.save();
    res.status(200).json({ message: 'Signup successfully', token });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/token', async (req, res, next) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });
  const token = await MToken.findOne({ refreshToken });
  try {
    const decoded = process.env.REFRESH_TOKEN_SECRET && jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!token) return res.status(404).json({ message: 'User not found' });
    const newToken = generateToken({ userId: token.user });
    const tokenChecking = { user: decoded && typeof decoded === 'object' && decoded['userId'] };
    const updateToken = {
      accessToken: newToken?.accessToken,
      refreshToken: newToken?.refreshToken,
      user: token.user
    };
    const updated = await MToken.findOneAndUpdate(tokenChecking, updateToken, { new: true });
    if (!updated) return res.status(400).json({ message: "Can't not refreshToken" });
    res.status(200).json({ data: updateToken, message: '' });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

const generateToken = (payload: any) => {
  if (process.env.ACCESS_TOKEN_SECRET && process.env.REFRESH_TOKEN_SECRET) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1m'
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1h'
    });
    return { accessToken, refreshToken };
  } else {
    return undefined;
  }
};

export = router;
