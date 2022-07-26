import express from 'express';
import postRouter from './routes/post';
import userRouter from './routes/user';

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

app.use('/api/post', postRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;