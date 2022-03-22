const express = require("express");
const router = express.Router();

const createPostController = require("../controllers/createPostController");

router.post("/create-posts", createPostController.create_post);

router.get("/create-posts", createPostController.create_post_get);

module.exports = router;
