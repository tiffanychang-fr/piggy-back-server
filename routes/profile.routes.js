// Remark - After user logged-in, user can access to personal profile via: dashboard > profile category

const { Router } = require("express");

const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const profileRouter = Router();

// GET /profile - Render user profile page
profileRouter.get("/", (req, res) => {
  const message = "You receive a response from the server";
  console.log("hello from req.body", req.body);
  console.log(message);
});

// GET /profile/edit - Edit user profile information
profileRouter.post("/edit", (req, res) => {
  const message = "You receive a response from the server";
  const { _id, username, email, password, city, country, phoneNumber } =
    req.body;

  if (
    username === "" ||
    email === "" ||
    password === "" ||
    city === "" ||
    country === "" ||
    phoneNumber === ""
  ) {
    res.status(400).json({
      message: "Provide username, email, password, city, country, phone number",
    });
    return;
  }

  // This regular expression check that the email is of a valid format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  User.findByIdAndUpdate(
    { _id },
    { username, email, city, country, phoneNumber },
    { new: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        // here andre and filipe are making sure that there is no user with that username. if there is, nah aha ha ahhhhhhhh
        // #Titos!

        return res.status(404).json({
          message:
            "Hello. Andre and Filipe were here at this moment. This message should be better, but we are writing it this way to make sure that Titos actually change the message and pay attention to the code they are writing. Dear user, if you see this, complain to the students",
        });
      }

      // move allof the shit downstairs to after you update the user

      const { username, email, city, country, phoneNumber } = updatedUser;

      // Create an object that will be set as the token payload
      const payload = { username, email, city, country, phoneNumber };

      // Create a JSON Web Token and sign it
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: "6h",
      });

      // update the user here. Because Andre And Filipe Were Here. You should update the user, kay?? Hm hmmmm. Snap
      // Titos!

      res.json({
        status: "ok",
        message: message,
        user: updatedUser,
        authToken: authToken,
      });
    })

    .catch((err) => console.log(err));
});

module.exports = profileRouter;
