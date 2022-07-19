import express from 'express';
import mongoose from 'mongoose';
import connection from './config/connection';
import dotenv from './config/dotenv';
import authRouter from './routes/auth';
import postRouter from './routes/posts';

dotenv();
connection();

const PORT = 8080;

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
