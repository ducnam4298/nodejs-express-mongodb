import util from 'util';
import multer from 'multer';
import Constants from '../file/constants';

const maxSize = 2 * 1024 * 1024;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, Constants.dirname + '/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize }
}).single('file');

export default util.promisify(uploadFile);
