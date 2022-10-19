// Remark - After user logged-in, user can access to all his/ her orders via: dashboard > my orders category

const { Router } = require("express");

const orderRouter = Router();

// GET /my-orders - Render user order history
orderRouter.get("/", (req, res) => {
  const message = "You receive a response from the server";
  res.json({ status: "ok", message: message });
});

// GET /my-orders/:orderId - Render single order detail that may contain live chat with seller if paid & order is confirmed
// Keep at the end of the page due to dynamic Id param
orderRouter.get("/:orderId", (req, res) => {
  const message = "You receive a response from the server";
  res.json({ status: "ok", message: message });
});
