const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  lastName: String,
  firstName: String,
  nationality: String
});

authorSchema.statics.findByAuthor = function (authorId, cb) {
  return this.model('Book').find({ author: authorId }, cb);
};

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;