const { Router } = require('express');
const userRouter = Router();
const User = require('../models/User');
const Image = require('../models/Image');
const { hash, compare } = require('bcryptjs');
const mongoose = require('mongoose');

userRouter.post("/register", async (req, res) => {
    try {
        if (req.body.password.length < 6)
            throw new Error("비밀번호를 최소 6자 이상으로 해주세요.");
        if (req.body.username.length < 3)
            throw new Error("username 3자 이상으로 해주세요.");

        const hashedPassword = await hash(req.body.password, 10);
        const user = await new User({
            name: req.body.name,
            username: req.body.username,
            hashedPassword,
            sessions: [{ createdAt: new Date() }]
        }).save();

        const session = user.sessions[0];
        res.json({
            message: "user registered",
            sessionId: session._id,
            name: user.name
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userRouter.patch("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        const isValid = await compare(req.body.password, user.hashedPassword);
        if (!isValid) throw new Error("입력하신 정보가 올바르지 않습니다.");

        user.sessions.push({ createdAt: new Date() });
        await user.save();

        const session = user.sessions[user.sessions.length - 1];
        res.json({
            message: "user validated",
            sessionId: session._id,
            name: user.name
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userRouter.patch("/logout", async (req, res) => {
    try {
        if (!req.user) throw new Error("invalid sessionid");

        await User.updateOne(
            { _id: req.user.id },
            { $pull: { sessions: { _id: req.headers.sessionid } } }
        );

        res.json({ message: "user is logged out." })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userRouter.get("/me", (req, res) => {
    try {
        if (!req.user) throw new Error("권한이 없습니다.");
        res.json({
            message: "success",
            sessionId: req.headers.sessionid,
            name: req.user.name,
            userId: req.user._id
        })
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

userRouter.get("/me/images", async (req, res) => {
    try {
        const { lastid } = req.query;
        if (lastid && !mongoose.isValidObjectId(lastid))
            throw new Error("Invlid lastid");

        if (!req.user) throw new Error("권한이 없습니다.");
        const images = await Image.find(
            lastid
                ? { "user._id": req.user.id, public: false, _id: { $lt: lastid } }
                : { "user._id": req.user.id, public: false }
        )
            .sort({ _id: -1 })
            .limit(4);

        res.json(images);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

module.exports = { userRouter }