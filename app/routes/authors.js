const { Router } = require("express");
const { readDatabaseFile, generateUniqueId, writeDatabaseFile } = require("../utils/database");

const authorDatabasePath = "./app/data/authors.json";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // get authors from database
    const authors = (await readDatabaseFile(authorDatabasePath)) || [];
    res.json(authors);
  } catch (error) {
    console.log("error: getting authors", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const authors = (await readDatabaseFile(authorDatabasePath)) || [];
    const author = authors.find((author) => author.id == id);
    if (!author) {
      return res.status(404).json({
        message: "Author not found",
      });
    }
    res.json(author);
  } catch (error) {
    console.log("error: getting authors", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
    try {
        let newAuthor = req.body;
        newAuthor.id = generateUniqueId()
        //TODO: validation
        let authors = await readDatabaseFile(authorDatabasePath) || [];
        authors.push(newAuthor)
        await writeDatabaseFile(authors)
        res.json(newAuthor);
  } catch (error) {
    console.log("error: creating author", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
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
