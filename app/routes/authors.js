const { Router } = require("express");
const { readDatabaseFile } = require("../utils/database");

const authorDatabasePath = "./app/data/authors.json"

const router = Router();

router.get("/", async (req, res) => {
    try {
        const authors = await readDatabaseFile(authorDatabasePath);
        res.json(authors)
    } catch (error) {
        console.log("error: getting authors", error.message)
        res.status(500).json({
            message: error.message
        })
    }
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