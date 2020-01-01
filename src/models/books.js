const mongoose = require('mongoose');

const Book = mongoose.model('Book', {
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
})

module.exports = Book;