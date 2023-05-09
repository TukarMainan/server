const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const ImageKit = require('imagekit');
const path = require("path");
const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '.jpg');
    }
});

const uploadImage = multer({ storage: storage });

module.exports = {
    uploadImage,
    imagekit,
}