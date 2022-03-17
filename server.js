const express = require("express");
const User = require("./models/userSchema");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcryptjs");

const app = express();

app.set("view engine", "ejs"); //set views type

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public")); //make folder public
app.use(express.urlencoded({ extended: true })); //allows for form data to work

const port = process.env.PORT || 3000;
const dbUri =
  "mongodb+srv://a:test@members.9cwrw.mongodb.net/auth?retryWrites=true&w=majority";

mongoose
  .connect(dbUri, { useNewUrlParser: true })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.render("index", { title: "sign-up" });
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up-form", { title: "sign up" });
});

app.post("/sign-up", (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});
