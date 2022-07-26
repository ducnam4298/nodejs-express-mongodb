import cors from 'cors';
import express from 'express';
import fileRouter from './routes/file';

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

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default app;