import express from 'express';
import connection from './config/connection';
import dotenv from './config/dotenv';
import authRouter from './routes/auth';
import tokenRouter from './routes/token';

dotenv();
connection();

const PORT = 9898;

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/token', tokenRouter);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
