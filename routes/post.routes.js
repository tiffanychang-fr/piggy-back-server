// Remark - After user logged-in, user can access to all of his/ her posts via: dashboard > my posts category

const { Router } = require("express");

const postRouter = Router();

// GET /my-posts - Render user posts history
postRouter.get("/", (req, res) => {
  const message = "You receive a response from the server";
  res.json({ status: "ok", message: message });
});

// POST /my-posts/create - create a post that asks for help from locals
postRouter.post("/create", (req, res) => {
  const message = "You receive a response from the server";
  res.json({ status: "ok", message: message });
});

// POST /my-posts/edit/:postId - edit a single post
postRouter.post("/edit/:postId", (req, res) => {
  const message = "You receive a response from the server";
  res.json({ status: "ok", message: message });
});

module.exports = postRouter;
