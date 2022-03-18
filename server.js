const express = require("express");
const User = require("./models/userSchema");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
// const { body, validationResult } = require("express-validator");
const { check, validationResult, body } = require("express-validator");
const res = require("express/lib/response");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs"); //set views type

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize()); //use passport
app.use(passport.session());
app.use(express.static("public")); //make folder public
app.use(express.urlencoded({ extended: true })); //allows for form data to work

const port = process.env.PORT || 3000;

const dbUri = process.env.dburl;
mongoose
  .connect(dbUri, { useNewUrlParser: true })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

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

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index", { title: "login", user: req.user });
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up-form", { title: "sign up" });
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.use(express.json());

app.post(
  "/sign-up",

  body("username").isLength({ min: 3 }).trim().escape(),
  body("password").isLength({ min: 3 }),
  body("passwordConfirmation").custom((value, { req }) => {
    console.log(value, req.body.password);
    if (req.body.confirmpassword !== req.body.password) {
      console.log("errrr");
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  (req, res, next) => {
    bcrypt.hash("somePassword", 10, (err, hashedPassword) => {
      // if err, do something
      // otherwise, store hashedPassword in DB

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).redirect("/sign-up");
      } else {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        }).save((err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      }
    });
  }
);

app.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});
