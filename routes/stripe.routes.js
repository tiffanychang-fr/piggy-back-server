const { Router } = require("express");
const stripeRouter = Router();
const mongoose = require("mongoose");
const queryString = require("query-string");
const User = require("../models/User.model");
const OfferModel = require("../models/Offer.model");
const OrderModel = require("../models/Order.model");

const stripe = require("stripe")(process.env.STRIPE_SECRET);

// POST /create-connect-account
stripeRouter.post("/create-connect-account", async (req, res) => {
  const username = req.body.username;

  // find user from DB
  const foundUser = await User.findOne({ username });

  // if user don't have stripe_account_id yet, create now
  if (!foundUser.stripe_account_id) {
    const account = await stripe.accounts.create({
      type: "express",
    });
    // console.log("ACCOUNT:", account);
    foundUser.stripe_account_id = account.id;
    foundUser.save();
  }

  // create login link based on account id (for frontend to complete onboarding)
  let accountLink = await stripe.accountLinks.create({
    account: foundUser.stripe_account_id,
    refresh_url: process.env.STRIPE_REDIRECT_URL,
    return_url: process.env.STRIPE_REDIRECT_URL,
    type: "account_onboarding",
  });

  // prefill any info such as email
  accountLink = Object.assign(accountLink, {
    "stripe_user[email]": foundUser.email || undefined,
  });

  // console.log("ACCOUNT LINK", accountLink);
  let link = `${accountLink.url}?${queryString.stringify(accountLink)}`;
  // console.log("LOGIN LINK:", link);

  res.json({ link });
});

// POST /get-account-status
stripeRouter.post("/get-account-status", async (req, res) => {
  // console.log("GET ACCOUNT STATUS");
  const { username } = req.body;
  const user = await User.findOne({ username });
  const account = await stripe.accounts.retrieve(user.stripe_account_id);
  // console.log("USER ACCOUNT RETRIEVE", account);
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      stripe_seller: account,
    },
    { new: true }
  ).select("-password");
  // console.log(updatedUser);
  res.json(updatedUser);
});

// POST /get-account-balance
stripeRouter.post("/get-account-balance", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: user.stripe_account_id,
    });

    res.json(balance);
  } catch (error) {
    console.log(error);
  }
});

// POST /payout-setting
stripeRouter.post("/payout-setting", async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    const loginLink = await stripe.accounts.createLoginLink(
      user.stripe_account_id
    );
    // console.log("Login link:", loginLink);
    res.json(loginLink);
  } catch (error) {
    console.log("Stripe payout setting error:", error);
  }
});

// POST /stripe-session-id
stripeRouter.post("/stripe-session-id", async (req, res) => {
  const { offerId } = req.body;
  // find the offer based on offer id from db
  const item = await OfferModel.findById(offerId).populate("proposedBy");
  // set 20% charge as application fee
  const fee = (item.price * 20) / 100;
  // create a session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // purchasing item details, it will be shown to user on checkout
    line_items: [
      {
        name: item.post,
        price_data: {
          currency: "eur",
          unit_amount: item.price * 100,
          product_data: {
            name: "item.post",
            description: "item.sellerMessage",
          },
        },
        quantity: 1,
      },
    ],
    // create payment intent with application fee and destination charge 80%
    payment_intent_data: {
      application_fee_amount: fee * 100,
      // this seller can see his balance in our frontend dashboard
      transfer_data: {
        destination: item.proposedBy.stripe_account_id,
      },
    },
    mode: "payment",
    // success and calcel urls
    success_url: `${process.env.STRIPE_SUCCESS_URL}/${item._id}`,
    cancel_url: process.env.STRIPE_CANCEL_URL,
  });

  try {
    // add this session object to user in the db
    await User.findByIdAndUpdate(item.receivedBy, { stripeSession: session });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.log("Stripe payout process error:", error);
  }
});

// POST /stripe-success - if stripe payment is successful, then create an order
stripeRouter.post("/stripe-success", async (req, res) => {
  const { userId, offerId } = req.body;

  try {
    // find currently logged in user
    const user = await User.findById(userId);
    // check if user has stripeSession
    if (!user.stripeSession) return;
    // retrieve stripe session, based on session id we previously save in user db
    const session = await stripe.checkout.sessions.retrieve(
      user.stripeSession.id
    );
    // if session payment status is paid, create order
    if (session.payment_status === "paid") {
      // check if order with that session id already exist by querying orders collection
      const foundOrder = await OrderModel.findOne({
        "session.id": session.id,
      });
      if (foundOrder) {
        // if order exist, send success true
        res.json({ success: true });
      } else {
        const offer = await OfferModel.findById(offerId).populate("proposedBy");

        // else create new order and send success true
        let newOrder = await new OrderModel({
          offer: offerId,
          session,
          orderedBy: userId,
          soldBy: offer.proposedBy._id,
        }).save();

        // remove user's stripeSession
        await User.findByIdAndUpdate(userId, {
          $set: { stripeSession: {} },
        });

        // set offer isAccepted into true
        await OfferModel.findById(offerId, {
          $set: { isAccepted: true },
        });

        res.json({ success: true });
      }
    }
  } catch (error) {
    console.log("STRIPE SUCCESS ERR", error);
  }
});

module.exports = stripeRouter;
