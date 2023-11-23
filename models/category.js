const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    enum: ['Horror', 'Mystery'],
    required: true
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;