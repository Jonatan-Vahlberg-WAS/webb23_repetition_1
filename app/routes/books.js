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
const { filterBooks, sortBooks } = require("../utils/database/books");

const bookDatabasePath = "./app/data/books.json";

const router = Router();

router.get("/", async (req, res) => {
  const { sortby } = req.query;
  try {
    // get books from database
    let books = (await readDatabaseFile(bookDatabasePath)) || [];
    
    books = filterBooks(books, req.query);
    books = sortBooks(books, sortby);
    
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
    if (books.some(book => book.isbn === newBook.isbn)) {
      return res.status(409).json({
        message: "Book with this ISBN already exists",
      });
    }
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

router.put("/:id/loan", async (req, res) => {
  try {
    const id = req.params.id;
    const books = (await readDatabaseFile(bookDatabasePath)) || [];
    const bookIndex = books.findIndex((book) => book.id == id);
    if (bookIndex === -1) {
      return res.status(404).json({
        message: "Book not found",
      });
    }
    if (books[bookIndex].count === 0) {
      return res.status(400).json({
        message: "No copies left",
      });
    }
    books[bookIndex].count--;
    await writeDatabaseFile(bookDatabasePath, books);
    res.json(books[bookIndex]);
  }
  catch (error) {
    console.log("error: lending book", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id/return", async (req, res) => {
  try {
    const id = req.params.id;
    const books = (await readDatabaseFile(bookDatabasePath)) || [];
    const bookIndex = books.findIndex((book) => book.id == id);
    if (bookIndex === -1) {
      return res.status(404).json({
        message: "Book not found",
      });
    }
    books[bookIndex].count++;
    await writeDatabaseFile(bookDatabasePath, books);
    res.json(books[bookIndex]);
  }
  catch (error) {
    console.log("error: returning book", error.message);
    // Should be inacessible
    res.status(500).json({
      message: error.message,
    });
  }
})

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
