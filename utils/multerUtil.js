import multer from 'multer';
import path from 'path';

const singleUpload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.svg') {
      return cb(new Error('Only images are allowed'), false);
    }
    cb(null, true);
  },
}).single('image');

export default singleUpload;
