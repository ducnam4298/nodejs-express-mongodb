import express from 'express';
import authRouter from './routes/auth';
import tokenRouter from './routes/token';

const PORT = process.env.PORT || 8081;

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/token', tokenRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;