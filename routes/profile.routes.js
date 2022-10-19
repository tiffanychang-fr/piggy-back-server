// Remark - After user logged-in, user can access to personal profile via: dashboard > profile category

const { Router } = require("express");

const profileRouter = Router();

// GET /profile - Render user profile page
profileRouter.get("/", (req, res) => {
  const message = "You receive a response from the server";
  res.json({ status: "ok", message: message });
});

// GET /profile/edit - Edit user profile information
profileRouter.post("/edit", (req, res) => {
  const message = "You receive a response from the server";
  res.json({ status: "ok", message: message });
});
