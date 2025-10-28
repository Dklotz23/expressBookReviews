const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn
    return res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookArray = Object.values(books);

  const matchingBooks = bookArray.filter(book => 
    book.author.trim().toLowerCase() === author.trim().toLowerCase()
);
if (matchingBooks.length > 0) {
    return res.status(200).json({ 
        message: `Books found by author: ${author}`,
        books: matchingBooks 
    });
} else {
    return res.status(404).json({ 
        message: `No books found by author: ${author}` 
    });
}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookArray = Object.values(books);
  
    const matchingBooks = bookArray.filter(book => 
      book.title.trim().toLowerCase() === title.trim().toLowerCase()
  );
  
  if (matchingBooks.length > 0) {
      return res.status(200).json({ 
          message: `Books found by title: ${title}`,
          books: matchingBooks 
      });
  } else {
      return res.status(404).json({ 
          message: `No books found by author: ${title}` 
      });
  }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;;
  
    if (!books[isbn].reviews) {
        return res.send(books[isbn].reviews)
    } else {
        return res.status(404).json({message: "No reviews at this time."})
    }
  });

module.exports.general = public_users;
