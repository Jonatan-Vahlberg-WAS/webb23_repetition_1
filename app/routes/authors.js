const { Router } = require("express");
const {
  readDatabaseFile,
  generateUniqueId,
  writeDatabaseFile,
} = require("../utils/database");
const {
  validateAuthor,
  validateAuthorUpdate,
} = require("../utils/validation/authors");

const authorDatabasePath = "./app/data/authors.json";
const bookDatabasePath = "./app/data/books.json";

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
    console.log("error: getting author", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let newAuthor = req.body;
    newAuthor.id = generateUniqueId();
    const [errors, hasErrors] = validateAuthor(newAuthor);
    if (hasErrors) {
      return res.status(400).json({
        errors,
      });
    }
    let authors = (await readDatabaseFile(authorDatabasePath)) || [];
    authors.push(newAuthor);
    await writeDatabaseFile(authorDatabasePath, authors);
    res.json(newAuthor);
  } catch (error) {
    console.log("error: creating author", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newAuthor = req.body;
    const [errors, hasErrors] = validateAuthorUpdate(newAuthor, { id });
    if (hasErrors) {
      return res.status(400).json({
        errors,
      });
    }
    let authors = (await readDatabaseFile(authorDatabasePath)) || [];
    const authorIndex = authors.findIndex((author) => author.id == id);

    if (authorIndex === -1) {
      return res.status(404).json({
        message: "Author not found",
      });
    }

    if (authors[authorIndex].name !== newAuthor.name) {
      let books = (await readDatabaseFile(bookDatabasePath)) || [];
      books.forEach((book) => {
        if (book.author.name === authors[authorIndex].name) {
          book.author.name = newAuthor.name;
        }
      });
      await writeDatabaseFile(bookDatabasePath, books);
    }
    authors[authorIndex] = newAuthor;

    await writeDatabaseFile(authorDatabasePath, authors);
    res.json(newAuthor);
  } catch (error) {
    console.log("error: updating author", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let authors = (await readDatabaseFile(authorDatabasePath)) || [];
    const authorIndex = authors.findIndex((author) => author.id == id);
    if (authorIndex === -1) {
      return res.status(404).json({
        message: "Author not found",
      });
    }
    authors.splice(authorIndex, 1);

    await writeDatabaseFile(authorDatabasePath, authors);
    res.status(204).end();
  } catch (error) {
    console.log("error: deleting author", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
