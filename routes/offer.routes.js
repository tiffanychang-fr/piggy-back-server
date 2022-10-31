const { Router } = require("express");
const mongoose = require("mongoose");
const OfferModel = require("../models/Offer.model");
const PostModel = require("../models/Post.model");
// const UserModel = require("../models/User.model");

const offerRouter = Router();

// GET /get-all-offers - Get all offers from the offer DB
offerRouter.get("/get-all-offers", (req, res) => {
  const { userId } = req.query;
  console.log(userId);

  OfferModel.find({ receivedBy: userId })
    .then((foundOffers) => {
      res.json(foundOffers);
    })
    .catch((error) => console.log(error));
});

// GET /get-all-offers-by-post - Get all offers by post from the offer DB
offerRouter.get("/get-all-offers-by-post", (req, res) => {
  const { postId } = req.query;

  OfferModel.find({ post: postId })
    .then((foundOffers) => {
      res.json(foundOffers);
    })
    .catch((error) => console.log(error));
});

// GET /create-offer/:postId - Make an offer to a post
offerRouter.get("/create-offer/:postId", (req, res) => {
  // Validation: if logged in user is post owner, then cannot make an offer to him/ herself
  // const { userId, postByUserId } = req.query;
  // if (userId === postByUserId) return;
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

  PostModel.findById(postId)
    .then((foundPost) => {
      let postById = foundPost.postBy;

      OfferModel.create({
        post: postId,
        sellerMessage: sellerMessage,
        price: price,
        receivedBy: mongoose.Types.ObjectId(postById),
        proposedBy: userId,
        isAccepted: false,
      })
        .then((createdOffer) => {
          res.json(createdOffer);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

module.exports = offerRouter;
