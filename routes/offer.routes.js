const { Router } = require("express");
const OfferModel = require("../models/Offer.model");

const offerRouter = Router();

// GET /get-all-offers - Get the offers from the offer DB
offerRouter.get("/get-all-offers", (req, res) => {
  res.json({ status: "ok" });
});

// GET /create-offer/:postId - Make an offer to a post
offerRouter.get("/create-offer/:postId", (req, res) => {
  res.json({ status: "ok" });
});

// POST /create-offer/:postId - Make an offer to a post
offerRouter.post("/create-offer/:postId", (req, res) => {
  const { sellerMessage, price } = req.body;
  const { postId } = req.params;
  const userId = req.query.userId;

  if (sellerMessage === "" || price === "") {
    res.status(400).json({
      message: "Provide price and seller message.",
    });
    return;
  }

  OfferModel.create({
    post: postId,
    sellerMessage: sellerMessage,
    price: price,
    proposedBy: userId,
    isAccepted: false,
  })
    .then((createdOffer) => {
      res.json(createdOffer);
    })
    .catch((error) => console.log(error));
});

module.exports = offerRouter;
