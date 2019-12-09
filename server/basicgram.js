const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const axios = require("axios");
// redis stuff
const redis = require("redis");
const redisClient = redis.createClient();
// redis stuff

// mongoosey stuff
const mongoose = require("mongoose");
const BasicgramsLib = require("./library/posts-lib.js");
const CommentsLib = require("./library/comments-lib.js");
require("./models/user-model.js");
require("./models/basicgramModel.js");
require("./models/commentModel.js");

const MONGODB_URI = "mongodb://localhost:27017/basicgram-database";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", error => {
  console.log("ERROR: " + error);
});
// mongoosey stuff

// *** image stuff ***
let multer = require("multer");
let storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});
let imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("jpg, jpeg, png, or gif format only"), false);
  }
  cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter });
let cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dzjtqbbua",
  api_key: "559561864892248",
  api_secret: "n1jUnMK_r3B3hGuVIHasS7kHj1Y"
});
// *** image stuff ***

// express app stuff
const app = express();
app.use(cookieParser());
app.use(bodyParser());
// Middleware caches token auth result
app.use((req, res, next) => {
  const token = req.cookies.token;
  const userId = req.cookies.userId;
  const body = {
    token,
    userId
  };

  redisClient.get(token, (err, cachedValue) => {
    console.log(err);

    if (cachedValue) {
      console.log("Cache hit!", cachedValue);
      if (cachedValue === "true") {
        console.log(cachedValue);
        return next();
      } else {
        res.status(403);
        return res.send({
          valid: false
        });
      }
    } else {
      axios
        .post("http://localhost:4000/auth/verify", body)
        .then(response => {
          console.log(response);
          if (response.data && response.data.valid) {
            console.log(response);
            redisClient.set(token, true);
            return next();
          } else {
            redisClient.set(token, false);
            res.status(403);
            return res.send({
              valid: false
            });
          }
        })
        .catch(e => {
          console.log(e);
          res.status(404);
          return res.send({
            valid: false
          });
        });
    }
  });
});

// create new post
app.post("/basicgrams/new", upload.single("file"), (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  cloudinary.uploader.upload(req.file.path, (result) => {


    const author = req.cookies.userId;
    const caption = req.body.caption || "";
    const image = result.secure_url;
    const imageThumbnail =
      "http://res.cloudinary.com/dzjtqbbua/image/upload/c_fit,h_400,w_400/" +
      result.public_id;

    // get author name and username
    BasicgramsLib.createBasicgram(author, caption, image, imageThumbnail, res);
  });
});

// get all posts
app.get("/basicgrams", (req, res) => {
  BasicgramsLib.getAllBasicgrams(res);
});

// get post by basicgram id
app.get("/basicgrams/:id", (req, res) => {
  const basicgramId = req.params.id;

  BasicgramsLib.getBasicgramById(basicgramId, res);
});

// get post by user id
app.get("/basicgrams/user/:id", (req, res) => {
  const userId = req.params.id;

  BasicgramsLib.getBasicgramsByUser(userId, res);
});

// Comment endpoints
// create new comment
app.post("/basicgrams/comment/new", (req, res) => {
  const author = req.cookies.userId;
  const post = req.body.postId;
  const text = req.body.text;

  CommentsLib.createComment(author, post, text, res);
});

// find comment by Id
app.get("/basicgrams/comment/:id", (req, res) => {
  const commentId = req.params.id;

  CommentsLib.getCommentById(commentId, res);
});

// find comments by post
app.get("/basicgrams/comment/post/:id", (req, res) => {
  const postId = req.params.id;

  CommentsLib.getCommentsByPost(postId, res);
});

const PORT = 5000;
app.listen(PORT);

// /express app stuff
