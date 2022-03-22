const express = require("express");
const User = require("../models/userSchema");
const { check, validationResult, body } = require("express-validator");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const res = require("express/lib/response");
const session = require("express-session");
const passport = require("passport");
const user = require("../models/userSchema");
const router = express.Router();

const sign_up_get = (req, res) => {
  res.render("sign-up-form", { title: "sign up", user: req.user, errMsg: "" });
};

const sign_up_post = (req, res, next) => {
  bcrypt.hash("somePassword", 10, (err, hashedPassword) => {
    user
      .find({ username: req.body.username })
      .then((result) => {
        if (result[0].username == req.body.username) {
          res.render("sign-up-form", {
            title: "sign up",
            user: req.user,
            errMsg: "user already exists ",
          });
        }
      })
      .catch(() => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).redirect("/sign-up");
        } else {
          const user = new User({
            username: req.body.username,
            password: hashedPassword,
            isMember: req.body.isMember,
          }).save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/");
          });
        }
      });
  });
};

module.exports = { sign_up_get, sign_up_post };
