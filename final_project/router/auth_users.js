const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Missing Username or Password"})
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 6000 * 6000});

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json( {message: "Successfully Logged In"});
    } else {
        return res.status(404).json({message: "Authorization Failed"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const user = req.session.user;
    const isbn = req.params.isbn;
    const newReview = req.query.review;
    const review = {username: user, reviews: newReview};
    books[isbn].reviews = review;

    return res.status(202).send(`Review Added: ${books[isbn].reviews}`)
    
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    books[isbn].reviews = {}
    return res.status(200).json({messsage:"Review deleted"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
