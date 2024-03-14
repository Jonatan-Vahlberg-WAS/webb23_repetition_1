

function validateAuthor(author) {
    let errors = new Map();
    if (!author.name) {
        errors.set("name", "Name is required");
    }
    if (!author.yearOfBirth) {
        errors.set("email", "Year of birth is required");
    }

    return [Object.fromEntries(errors), errors.size > 0, errors];
}

function validateAuthorUpdate(author, oldAuthor) {
    let errors = validateAuthor(author)[2]

    if(author.id !== oldAuthor.id) {
        errors.set("id", "ID cannot be changed");
    }

    return [Object.fromEntries(errors), errors.size > 0];
}

module.exports = {
    validateAuthor,
    validateAuthorUpdate
};