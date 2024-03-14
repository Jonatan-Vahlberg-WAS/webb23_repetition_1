const { readDatabaseFile, writeDatabaseFile } = require("../utils/database");

const bookDatabasePath = "./app/data/books.json";

async function addCoverToBooks() {
  try {
    let books = await readDatabaseFile(bookDatabasePath);
      let booksWithISBN = books.filter((book) => book.isbn);
      let countFound = 0;
    console.log("Add covers to books with ISBN: count", booksWithISBN.length);
    await Promise.all(booksWithISBN.map(async (book) => {
        try {
          const response = await fetch(
            `https://openlibrary.org/isbn/${book.isbn}.json`
          );
            const data = await response.json();
          const cover = data.covers?.[0];
          if (cover) {
            const bookIndex = books.findIndex((b) => b.isbn === book.isbn);
            books[
              bookIndex
            ].cover = `https://covers.openlibrary.org/b/id/${cover}-M.jpg`;
            countFound++;
          }
        } catch (error) {
          console.log("error", error);
        }
      })
    );
    console.log("Covers found", countFound);
      await writeDatabaseFile(bookDatabasePath, books);
      console.log("Covers added to books");
  } catch (error) {
    console.log("error", error);
  }
}

addCoverToBooks();
