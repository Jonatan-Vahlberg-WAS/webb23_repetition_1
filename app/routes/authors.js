const { Router } = require("express");

const router = Router();

//TODO: add routes here
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the authors API" });
});

module.exports = router;