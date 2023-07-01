const multer = require("multer");
const path = require("path");

const storageProducts = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(`${__dirname}/public/uploads/products/`));
      
    },
    // filename: function (req, file, cb) {
    //   console.log("🚀 ~ file: upload-img.js:12 ~ file", file);
    //   cb(null, `${Date.now()}-${file.originalname}`);
    // },
  });
  
  const uploader = multer({
    storageProducts,
    onError: function (err, next) {
      console.log("🚀 ~ file: upload-img.js:17 ~ err", err);
      next();
    },
  });
  
  module.exports = {
    uploader
  };