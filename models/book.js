const mongoose = require('mongoose');
const Joi = require('joi')

const {Schema} = mongoose;
const bookSchema = new mongoose.Schema({
  title: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }]
});

bookSchema.path('title').validate({
  validator: (value) => Joi.string().required().validate(value).error === undefined,
  message: 'Le titre est requis et doit être une chaîne de caractères.',
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;





