const { Router } = require("express");
const {
  readDatabaseFile,
  generateUniqueId,
  writeDatabaseFile,
} = require("../utils/database");
const {
  validateBook,
  validateBookUpdate,
} = require("../utils/validation/books");

const bookDatabasePath = "./app/data/books.json";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // get books from database
    const books = (await readDatabaseFile(bookDatabasePath)) || [];
    res.json(books);
  } catch (error) {
    console.log("error: getting books", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const books = (await readDatabaseFile(bookDatabasePath)) || [];
    const book = books.find((book) => book.id == id);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }
    res.json(book);
  } catch (error) {
    console.log("error: getting book", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    let newBook = req.body;
    newBook.id = generateUniqueId();
    const [errors, hasErrors] = validateBook(newBook);
    if (hasErrors) {
      return res.status(400).json({
        errors,
      });
    }
    let books = (await readDatabaseFile(bookDatabasePath)) || [];
    books.push(newBook);
    await writeDatabaseFile(bookDatabasePath, books);
    res.json(newBook);
  } catch (error) {
    console.log("error: creating book", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newBook = req.body;
    const [errors, hasErrors] = validateBookUpdate(newBook, { id });
    if (hasErrors) {
      return res.status(400).json({
        errors,
      });
    }
    let books = (await readDatabaseFile(bookDatabasePath)) || [];
    const bookIndex = books.findIndex((book) => book.id == id);

    if (bookIndex === -1) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    books[bookIndex] = newBook;
    await writeDatabaseFile(bookDatabasePath, books);
    res.json(newBook);
  } catch (error) {
    console.log("error: updating book", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let books = (await readDatabaseFile(bookDatabasePath)) || [];
    const bookIndex = books.findIndex((book) => book.id == id);
    if (bookIndex === -1) {
      return res.status(404).json({
        message: "Book not found",
      });
    }
    books.splice(bookIndex, 1);

    await writeDatabaseFile(bookDatabasePath, books);
    res.status(204).end();
  } catch (error) {
    console.log("error: deleting book", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
