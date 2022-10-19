const express = require("express");
const router = express.Router();

// GET /api
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
