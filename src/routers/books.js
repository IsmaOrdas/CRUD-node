const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const Book = require('../models/books')

router.post('/books', auth, async (req, res) => {
  //const book = new Book(req.body)
  const book = new Book({
    ...req.body,
    owner: req.user._id
  })

  console.log(book)

  try {
    await book.save()
    res.status(201).send(book)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/books', auth, async (req, res) => {
  try {
    /*const books = await Book.find({})
    res.status(200).send(books)*/

    await req.user.populate('books').execPopulate()
    res.send(req.user.books)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/books/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const book = await Book.findOne({ _id, owner: req.user._id })

    if (!book) {
      return res.status(404).send();
    }
    res.status(200).send(book)

  } catch (e) {
    res.status(500).send();
  }
})

router.patch('/books/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['author', 'title'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  const _id = req.params.id;

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid operation' })
  }
  
  try {
    //const book = await Book.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
    const book = await Book.findOne({ _id, owner: req.user._id })


    if (!book) {
      return res.status(404).send()
    }

    updates.forEach(update => book[update] = req.body[update])
    await book.save();

    res.send(book)
  } catch (e) {
    res.status(500).send()
  }
})

router.delete('/books/:id', auth, async (req, res) => {
  try {
    console.log(req.user)
    const book = await Book.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!book) {
      res.status(404).send()
    }

    res.send(book)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router;