const express = require("express");
const userMessage = require("../models/messageSchema");

const router = express.Router();

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
const create_post_get = (req, res) => {
  res.render("createPosts", { title: "create posts", user: req.user });
};

const create_post = (req, res) => {
  //send post info to database
  const user_msg = new userMessage({
    name: req.user.username,
    messageSubject: req.body.messageSubject,
    message: req.body.message,
  }).save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
};

module.exports = { create_post, create_post_get };
