const multer = require('multer');

//set storage for images
const storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/upload/images');
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

module.exports = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3
  }
});