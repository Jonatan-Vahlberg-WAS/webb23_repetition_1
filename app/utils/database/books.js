function filterByGenre(books = [], genre) {
  return books.filter((book) =>
    book.genres.map((genre) => genre.toLowerCase()).includes(genre.toLowerCase())
  );
}

function filterBooks(books = [], query = {}) {
  const { genre, author, sortBy } = query;
  if (genre) {
    books = filterByGenre(books, genre);
  }
  if (author) {
    books = books.filter((book) => book.author.name === author);
  }
  if (sortBy === "title") {
    books = books.sort((a, b) => a.title.localeCompare(b.title));
  }
  return books;
}

function sortBooks(books = [], sortBy) {
  if (sortBy === "title") {
    books = books.sort((a, b) => a.title.localeCompare(b.title));
  }
  return books;
}

module.exports = {
  filterBooks,
  sortBooks,
};
