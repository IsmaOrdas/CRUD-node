const express = require('express');
const router = new express.Router();
const Book = require('../models/books')

router.post('/books', async (req, res) => {
  const book = new Book(req.body)

  try {
    await book.save()
    res.status(201).send(book)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/books', async (req, res) => {
  try {
    const books = await Book.find({})
    res.status(200).send(books)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/books/:id', async (req, res) => {
  const _id = req.params.id;

  try {
    const book = await Book.findById(_id)

    if (!book) {
      return res.status(404).send();
    }
    res.status(200).send(book)

  } catch (e) {
    res.status(500).send();
  }
})

router.patch('/books/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['author', 'title'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  const _id = req.params.id;

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid operation' })
  }
  
  try {
    const book = await Book.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})

    if (!book) {
      return res.status(404).send()
    }

    res.send(book)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router;