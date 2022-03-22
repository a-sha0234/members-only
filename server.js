const express = require("express");
const User = require("./models/userSchema");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const createPostsRoutes = require("./routes/createPosts");
const signUpRoutes = require("./routes/sign-up-Routes");

const { check, validationResult, body } = require("express-validator");
const res = require("express/lib/response");
const user = require("./models/userSchema");
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

const dbUri = process.env.dburl;
mongoose
  .connect(dbUri, { useNewUrlParser: true })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

// passport.use(
//   new LocalStrategy((username, password, done) => {
//     User.findOne({ username: username }, (err, user) => {
//       if (err) {
//         return done(err);
//       }
//       if (!user) {
//         return done(null, false, { message: "Incorrect username" });
//       }
//       bcrypt.compareSync(password, user.password, (err, res) => {
//         if (res) {
//           // passwords match! log user in
//           return done(null, user);
//         } else {
//           // passwords do not match!
//           return done(null, false, { message: "Incorrect password" });
//         }
//       });
//       return done(null, user);
//     });
//   })
// );

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

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

// app.get("/sign-up", (req, res) => {
//   res.render("sign-up-form", { title: "sign up", user: req.user, errMsg: "" });
// });

// app.get("/create-posts", (req, res) => {
//   res.render("createPosts", { title: "create posts", user: req.user });
// });

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.use(express.json());

// app.post(
//   "/sign-up",

//   body("username").isLength({ min: 3 }).trim().escape(),
//   body("password").isLength({ min: 3 }),

//   body("passwordConfirmation").custom((value, { req }) => {
//     if (req.body.confirmpassword !== req.body.password) {
//       throw new Error("Password confirmation does not match password");
//     }
//     return true;
//   }),

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
// );

// app.post("/create-posts", (req, res) => {
//   //send post info to database
//   const user_msg = new userMessage({
//     name: req.user.username,
//     messageSubject: req.body.messageSubject,
//     message: req.body.message,
//   }).save((err) => {
//     if (err) {
//       console.log(err);
//     } else {
//       res.redirect("/");
//     }
//   });
// });

app.use(signUpRoutes);
app.use(createPostsRoutes);

app.get("/log-out", (req, res) => {
  req.logout();
  res.redirect("/");
});
