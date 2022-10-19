// Remark - After user logged-in, user can access to seller page via: dashboard > seller category

const { Router } = require("express");

const sellerRouter = Router();

// GET /seller - Render seller page that contains stripe payment balance, pending orders, confirmed orders, live chat for confirmed orders.
sellerRouter.get("/", (req, res) => {
  const message = "You receive a response from the server";
  res.json({ status: "ok", message: message });
});
