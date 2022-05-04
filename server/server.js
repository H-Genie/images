// express
const express = require('express');
const app = express();
const PORT = 5000;

// multer
const { v4: uuid } = require('uuid');
const mime = require('mime-types');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, `${uuid()}.${mime.extension(file.mimetype)}`)
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (['image/jpeg', 'image/png'].includes(file.mimetype)) cb(null, true);
        else cb(new Error('invalid file type'), false);
    },
    limits: { fileSize: 1024 * 1024 * 5 }
});

// middleware
app.use("uploads", express.static("uploads"));

// router
app.post('/upload', upload.single("image"), (req, res) => {
    console.log(req.file);
    res.json(req.file);
});

// port
app.listen(PORT, () => console.log(`Express server listening on PORT ${PORT}`));