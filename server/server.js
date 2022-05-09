// express
const express = require('express');
const app = express();

// env
require('dotenv').config();
const { MONGO_URI, PORT } = process.env

// mongoose
const mongoose = require('mongoose');
const { imageRouter } = require('./routes/imageRouter');
const { userRouter } = require('./routes/userRouter')

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected.");

        // middleware
        app.use("/uploads", express.static("uploads"));
        app.use(express.json());

        // router
        app.use("/images", imageRouter);
        app.use("/users", userRouter);

        // listen
        app.listen(PORT, () => console.log(`Express server listening on PORT ${PORT}`));
    })
    .catch(err => console.log(err));