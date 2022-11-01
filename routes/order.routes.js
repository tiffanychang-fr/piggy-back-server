const { Router } = require("express");
const OrderModel = require("../models/Order.model");

const orderRouter = Router();

// GET /my-orders - Render user orders
orderRouter.get("/", (req, res) => {
  const { userId } = req.query;

  OrderModel.find({ orderedBy: userId })
    .populate("offer orderedBy soldBy")
    .then((foundOrders) => {
      res.json(foundOrders);
    })
    .catch((error) => console.log(error));
});

// GET /my-orders/:orderId - Render single order detail that may contain live chat with seller if paid & order is confirmed
// Keep at the end of the page due to dynamic Id param
orderRouter.get("/:orderId", (req, res) => {
  const message = "You receive a response from the server";
  res.json({ status: "ok", message: message });
});

module.exports = orderRouter;
