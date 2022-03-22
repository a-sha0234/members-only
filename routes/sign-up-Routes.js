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
const signupController = require("../controllers/sign-upControllers");

router.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
router.use(passport.initialize()); //use passport
router.use(passport.session());

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compareSync(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      });
      return done(null, user);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

router.use(express.json());

router.get("/sign-up", signupController.sign_up_get);

router.post(
  "/sign-up",

  body("username").isLength({ min: 3 }).trim().escape(),
  body("password").isLength({ min: 3 }),

  body("passwordConfirmation").custom((value, { req }) => {
    if (req.body.confirmpassword !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),
  signupController.sign_up_post

  //   (req, res, next) => {
  //     bcrypt.hash("somePassword", 10, (err, hashedPassword) => {
  //       user
  //         .find({ username: req.body.username })
  //         .then((result) => {
  //           if (result[0].username == req.body.username) {
  //             res.render("sign-up-form", {
  //               title: "sign up",
  //               user: req.user,
  //               errMsg: "user already exists ",
  //             });
  //           }
  //         })
  //         .catch(() => {
  //           const errors = validationResult(req);
  //           if (!errors.isEmpty()) {
  //             return res.status(400).redirect("/sign-up");
  //           } else {
  //             const user = new User({
  //               username: req.body.username,
  //               password: hashedPassword,
  //               isMember: req.body.isMember,
  //             }).save((err) => {
  //               if (err) {
  //                 return next(err);
  //               }
  //               res.redirect("/");
  //             });
  //           }
  //         });
  //     });
  //   }
);

module.exports = router;
