import express from 'express';
import fs from 'fs';
import { verifyToken } from '../../middleware/auth';
import uploadFile from '../../middleware/uploadFile';
import Constants from '../../file/constants';

const router = express.Router();

router.post('/uploadFile', verifyToken, async (req, res, next) => {
  try {
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }
    res.status(200).send({
      message: 'Uploaded the file successfully: ' + req.file.originalname
    });
  } catch (err: any) {
    if (err.code == 'LIMIT_FILE_SIZE') {
      return res.status(400).send({
        message: 'File size cannot be larger than 2MB!'
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file?.originalname}. ${err}`
    });
  }
});

router.get('/getFiles', verifyToken, async (req, res, next) => {
  const dirPath = Constants.dirname + '/uploads/';
  fs.readdir(dirPath, function (err, files) {
    if (err) {
      res.status(500).send({
        message: 'Unable to scan files!'
      });
    }
    let fileInfos: any[] = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: Constants.dirname + "\\" + file
      });
    });
    res.status(200).send(fileInfos);
  });
});

router.get('/downloadFile/:name', verifyToken, async (req, res, next) => {
  const fileName = req.params.name;
  const dirPath = Constants.dirname + '/uploads/';
  res.download(dirPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: 'Could not download the file. ' + err
      });
    }
  });
});

export = router;
