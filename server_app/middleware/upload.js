const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ file với multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/'); // Lưu trữ ảnh trong thư mục public/img
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất dựa trên thời gian
  },
});

// Kiểm tra loại file (chỉ cho phép ảnh)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép tải lên tệp ảnh.'));
  }
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
