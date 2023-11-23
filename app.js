const mongoose = require("mongoose");
const express = require("express");
const Book = require("./models/book");
const Author = require('./models/author');
const Category = require('./models/category');
const User = require("./models/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const app = express();
const Joi = require('./middlewares/joi');

app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/books")
  .then(() => console.log("Connexion réussie !!"))
  .catch(() => console.log("Connexion échouée !!!!!!"));



app.post("/api/author", (req, res) => {
  let newAuthor = new Author({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    nationality: req.body.nationality,
  });

  newAuthor
    .save(newAuthor)
    .then(() =>
      res.status(201).json({
        model: newAuthor,
        message: "Author Added !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error: error.message,
        message: "Invalid data !!!",
      })
    );
});

app.post("/api/category", (req, res) => {
  let newCategory = new Category({
    title: req.body.title,
    
  });

  newCategory
    .save(newCategory)
    .then(() =>
      res.status(201).json({
        model: newCategory,
        message: "Category Added !",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error: error.message,
        message: "Invalid data !!!",
      })
    );
});

app.post('/api/books', Joi.validateBook, async (req, res) => {
  try {
    const authorId = req.body.author;
    const authorBooks = await Book.find({ author: authorId });

    if (authorBooks.length > 0) {
      const bk = new Book(req.body);
      await bk.validate();
    
      const savedBook = await bk.save();
      res.status(201).json({
        model: savedBook,
        message: "Book created",
      });

    
  } else {
   
    res.status(400).json({ error: "The author doesn't have other books" })

 } 
}catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/books", (req, res) => {
  Book.find().populate('author').populate('categories')
    .then((books) =>
      res.status(200).json({
        model: books,
        message: "Success",
      })
    )
    .catch((error) =>
      res.status(400).json({
        error: error.message,
        message: "Problem !!",
      })
    );
});

app.get("/api/books/:id", (req, res) => {
  Book.findOne({ _id: req.params.id }).populate('author').populate('categories')
    .then((book) => {
      if (!book) {
        res.status(404).json({
          message: "Book not found !!",
        });
        return;
      }
      res.status(200).json({
        model: book,
        message: "Book Found",
      });
    })
    .catch((error) =>
      res.status(400).json({
        error: error.message,
        message: "Book doesn't exist !!!",
      })
    );
});

app.patch("/api/books/:id", (req, res) => {
  Book.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(
    (book) => {
      if (!book) {
        res.status(404).json({
          message: "Book Found !!",
        });
        return;
      }
      res.status(200).json({
        model: book,
        message: "Book updated with success",
      });
    }
  );
});

app.delete("/api/books/:id", (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Book deleted with success" }))
    .catch((error) =>
      res.status(400).json({
        error: error.message,
        message: "Book doesn't exist !!!",
      })
    );
});



app.post('/api/signup', Joi.validateSignUp, async (req, res) => {
  try {
  const hashedPassword = await bcrypt.hash(req.body.password);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role,
      email: req.body.email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const newUser = savedUser.toPublic();

    res.status(201).json({
      model: newUser,
      message: "User created",
    });
  } 
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})


app.post('/api/login', (req, res) => {
  User.findOne({ email: req.body.email})
    .then((user) => {
        if(!user){
            return res.status(401).json({message: "Incorrect Login or Password"})
        }
        bcrypt
        .compare(req.body.password, user.password).then((valid) => {
        if (!valid){
            return res.status(401).json({message: "Incorrect Login or Password"})
        }
        res.status(200).json({
            token : jwt.sign({userId: user._id}, "RANDOM_TOKEN_SECRET",{expiresIn: "24h"}),

        })
        })
        .catch((error) => res.status(500).json({error: error.message}))
    })

})

app.get('/api/books/author/:id', async (req, res) => {
  const authorId = req.params.id;
  try {
    
    const books = await Author.findByAuthor(authorId);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des livres par auteur.' });
  }
});



module.exports = app;
