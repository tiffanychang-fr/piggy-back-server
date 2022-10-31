const { Schema, model } = require("mongoose");

const offerSchema = new Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    sellerMessage: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    receivedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    proposedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Offer = model("Offer", offerSchema);

module.exports = Offer;
