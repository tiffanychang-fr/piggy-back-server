const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    offer: {
      type: Schema.Types.ObjectId,
      ref: "Offer",
    },
    session: {},
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    soldBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);

module.exports = Order;
