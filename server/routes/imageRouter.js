const fs = require('fs');
const { promisify } = require('util');
const { Router } = require('express');
const mongoose = require('mongoose');
const { s3 } = require('../aws');

const imageRouter = Router();
const { upload } = require('../middleware/ImageUpload');
const Image = require('../models/Image');

const fileUnlink = promisify(fs.unlink);

imageRouter.post('/', upload.array("image", 5), async (req, res) => {
    try {
        if (!req.user) throw new Error("권한이 없습니다.");

        const images = await Promise.all(
            req.files.map(async (file) => {
                const image = await new Image({
                    user: {
                        _id: req.user.id,
                        name: req.user.name,
                        username: req.user.username
                    },
                    public: req.body.pulic,
                    key: file.key.replace("raw/", ""),
                    originalFileName: file.originalname
                }).save();
                return image;
            })
        );

        res.json(images);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

imageRouter.get('/', async (req, res) => {
    try {
        const { lastid } = req.query;
        if (lastid && !mongoose.isValidObjectId(lastid)) throw new Error("Invlid lastid");

        const images = await Image.find(
            lastid ? {
                public: true,
                _id: { $lt: lastid }
            } : {
                public: true
            }
        )
            .sort({ _id: -1 })
            .limit(4);
        res.json(images);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

imageRouter.get("/:imageId", async (req, res) => {
    try {
        const { imageId } = req.params;
        if (!mongoose.isValidObjectId(req.params.imageId))
            throw new Error("이미지 ID가 올바르지 않습니다.");

        const image = await Image.findOne({ _id: imageId });
        if (!image) throw new Error("해당 이미지가 존재하지 않습니다.");
        if (!image.public && (!req.user || req.user.id !== image.user.id))
            throw new Error("권한이 없습니다");

        res.json(image);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

imageRouter.delete("/:imageId", async (req, res) => {
    try {
        if (!req.user) throw new Error("권한이 없습니다.");
        if (!mongoose.isValidObjectId(req.params.imageId))
            throw new Error("이미지 ID가 올바르지 않습니다.");

        const image = await Image.findOneAndDelete({ _id: req.params.imageId });
        if (!image) return res.json({ message: "존재하지 않는 이미지입니다." });
        // await fileUnlink(`./uploads/${image.key}`);
        s3.deleteObject({
            Bucket: 'h0.genie-images',
            Key: `raw/${image.key}`
        }, (error, data) => {
            if (error) throw error;
        });

        res.json({ message: "이미지가 삭제되었습니다." });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

imageRouter.patch("/:imageId/like", async (req, res) => {
    try {
        if (!req.user) throw new Error("권한이 없습니다.");
        if (!mongoose.isValidObjectId(req.params.imageId))
            throw new Error("이미지 ID가 올바르지 않습니다.");

        const image = await Image.findOneAndUpdate(
            { _id: req.params.imageId },
            { $addToSet: { likes: req.user.id } },
            { new: true }
        );

        res.json(image);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
    try {
        if (!req.user) throw new Error("권한이 없습니다.");
        if (!mongoose.isValidObjectId(req.params.imageId))
            throw new Error("이미지 ID가 올바르지 않습니다.");

        const image = await Image.findOneAndUpdate(
            { _id: req.params.imageId },
            { $pull: { likes: req.user.id } },
            { new: true }
        );

        res.json(image);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = { imageRouter }