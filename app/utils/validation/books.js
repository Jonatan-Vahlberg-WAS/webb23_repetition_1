

function validateBook(book) {
    let errors = new Map();
    if (!book.title) {
        errors.set("title", "Title is required");
    }
    if (!book.author) {
        errors.set("author", "Author is required");
    }
    if (typeof book.count !== "number") {
        errors.set("count", "Count is required");
    }
    if (!book.description) {
        errors.set("description", "Description is required");
    }

    if (!book.genres?.length) {
        errors.set("genres", "At least one genre is required");
    }

    return [Object.fromEntries(errors), errors.size > 0, errors];
}

function validateBookUpdate(book, oldBook) {
    let errors = validateBook(book)[2];
    
    if(book.id !== oldBook.id) {
        errors.set("id", "ID cannot be changed");
    }
    return [Object.fromEntries(errors), errors.size > 0];
}


module.exports = {
    validateBook,
    validateBookUpdate
};