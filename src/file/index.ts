import cors from 'cors';
import express from 'express';
import connection from '../config/connection';
import dotenv from '../config/dotenv';
import fileRouter from './routes/file';

dotenv();
connection();

const PORT = process.env.PORT || 8082;
const __basedir = __dirname;
global.__dirname = __basedir;
var corsOptions = {
  origin: 'http://localhost:8082'
};

const app = express();
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use('/file', fileRouter);

app.listen(PORT, () => console.log(`Running at localhost:${PORT}`));
