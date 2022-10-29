// Remark - After user logged-in, user can access to all of his/ her posts via: dashboard > my posts category
const { Router } = require("express");

const PostModel = require("../models/Post.model");
const UserModel = require("../models/User.model");
const postRouter = Router();

// GET /my-posts - Render user posts history
postRouter.get("/", (req, res) => {
  const userId = req.query.userId;

  PostModel.find({ postBy: userId })
    .then((allPosts) => {
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
      if (!foundUser) {
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
//GET /my-posts/details/:postId
postRouter.get(`/details/:postId`, (req, res) => {
  console.log(`hello from the details page`);
});

// GET /my-posts/edit/:postId - edit a single post
postRouter.get(`/edit/:postId`, (req, res) => {
  const message = "You receive a response from the server";
  res.status(200).json({ status: "ok", message: message });
});

// POST /my-posts/edit/:postId - edit a single post
postRouter.post(`/edit/:postId`, (req, res) => {
  const { title, description, city, country, budget } = req.body;
  const { postId } = req.params;

  if (
    title === "" ||
    description === "" ||
    country === "" ||
    city === "" ||
    budget === 0
  ) {
    res.status(400).json({
      message: "Provide username, email, password, city, country, phone number",
    });
    return;
  }

  PostModel.findByIdAndUpdate(
    postId,
    { title, description, country, city, budget },
    { new: true }
  )
    .then((updatedPost) => {
      if (!updatedPost) {
        return res.status(404).json({
          message: `Found no post to update`,
        });
      }
      const { title, description, country, city, budget } = updatedPost; // add the key's to the updated
      const payLoad = { title, description, country, city, budget };

      res.json({
        payLoad: payLoad,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

//DELETE /my-posts/delete/:postId
postRouter.delete("/delete/:postId", (req, res) => {
  console.log(`You have reached the delete route, please be carefull`);
  PostModel.findByIdAndDelete()
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = postRouter;
