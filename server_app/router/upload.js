const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, 'public/img/');
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, 'public/video/');
    } else {
      cb(new Error('File không hợp lệ'), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

module.exports = { upload };
