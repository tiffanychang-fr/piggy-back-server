const { Router } = require("express");
const OfferModel = require("../models/Offer.model");

const sellerRouter = Router();

// GET /seller - Render seller page that contains stripe payment balance, pending orders, confirmed orders, live chat for confirmed orders.
sellerRouter.get("/", (req, res) => {
  const { userId } = req.query;

  OfferModel.find({ proposedBy: userId, isAccepted: true })
    .populate("post receivedBy")
    .then((foundAcceptedOffers) => {
      res.json(foundAcceptedOffers);
    })
    .catch((error) => console.log(error));
});

module.exports = sellerRouter;
