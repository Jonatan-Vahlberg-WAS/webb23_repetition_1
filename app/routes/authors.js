const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
    //TODO: add get authors logic here
    res.status(404).send("Not implemented")
});

router.get("/:id", (req, res) => {
  //TODO: add get author logic here
  res.status(404).send("Not implemented");
});

router.post("/", (req, res) => {
  //TODO: add create author logic here
  res.status(404).send("Not implemented");
});

router.put("/:id", (req, res) => {
  //TODO: add update author logic here
  res.status(404).send("Not implemented");
});

router.delete("/:id", (req, res) => {
  //TODO: add delete authors logic here
  res.status(404).send("Not implemented");
});

module.exports = router;