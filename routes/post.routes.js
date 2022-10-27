// Remark - After user logged-in, user can access to all of his/ her posts via: dashboard > my posts category
const { Router } = require("express");

const PostModel = require("../models/Post.model");
const UserModel = require("../models/User.model");
const postRouter = Router();

// GET /my-posts - Render user posts history
postRouter.get("/", (req, res) => {
  // const message = "You receive a response from the server";
  // res.json({ status: "ok", message: message });
  const userId = req.query.userId;
  console.log(userId);

  console.log(`id from get route:`, userId);

  PostModel.find({ postBy: userId })
    .then((allPosts) => {
      console.log(`all the posts from the get route of post:`, allPosts);

      return res.json(allPosts);
    })
    .catch((err) => {
      console.log(err);
    });
});

// POST /my-posts/create - create a post that asks for help from locals
postRouter.post("/create", (req, res) => {
  const { title, description, city, country, budget } = req.body.requestBody;
  const username = req.body.username;

  if (
    title === "" ||
    description === "" ||
    city === "" ||
    country === "" ||
    budget === null
  ) {
    res.status(400).json({
      message: "Provide username, email, password, city, country, phone number",
    });
    return;
  }

  UserModel.findOne({ username })
    .then((foundUser) => {
      console.log(`foundUser:`, foundUser);
      if (!foundUser) {
        console.log("not working from this page");
        return res.status(400).json({
          errorMessage: "There is not such user",
        });
      }
      PostModel.create({
        title,
        description,
        city,
        country,
        budget,
        postBy: foundUser._id,
      })
        .then((createdPost) => {
          console.log(`createdPost data:`, createdPost);
          return res.json(createdPost);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
// POST /my-posts/edit/:postId - edit a single post
postRouter.post("/edit/:postId", (req, res) => {
  const message = "You receive a response from the server";
  res.json({ status: "ok", message: message });
});

module.exports = postRouter;
