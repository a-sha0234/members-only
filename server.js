const express = require("express");

const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");

const createPostsRoutes = require("./routes/createPosts");
const signUpRoutes = require("./routes/sign-up-Routes");

const userMessage = require("./models/messageSchema");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs"); //set views type

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize()); //use passport
app.use(passport.session());
app.use(express.static("public")); //make folder public
app.use(express.urlencoded({ extended: true })); //allows for form data to work

const port = process.env.PORT || 3000;

// const DBURL = process.env.DBURL;
mongoose
  .connect(process.env.DBURL, { useNewUrlParser: true })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  //retrive all posts and send to index
  userMessage
    .find()
    .sort({ createAt: -1 })
    .then((result) => {
      res.render("index", {
        title: "login",
        user: req.user,
        userPosts: result,
      });
    });
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.use(express.json());

app.use(signUpRoutes);
app.use(createPostsRoutes);

app.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});
app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
