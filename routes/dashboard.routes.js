// Remark - After user logged-in, user will be redirected to dashboard

const { Router } = require("express");

const dashboardRouter = Router();

// GET /dashboard - Render user dashboard page that contains profile, orders, posts, seller category
dashboardRouter.get("/", (req, res) => {
  const message = "You receive a response from the server";
  res.json({ status: "ok", message: message });
});
