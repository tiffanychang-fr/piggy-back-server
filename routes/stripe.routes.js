const { Router } = require("express");
const stripeRouter = Router();
const queryString = require("query-string");
const User = require("../models/User.model");

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

module.exports = stripeRouter;
