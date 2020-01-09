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

  try {
    await book.save()
    res.status(201).send(book)
  } catch (e) {
    res.status(400).send(e)
  }
})

// GET /books?read=true
// GET /books?limit=10&skip=2
// GET /books?sortBy=createdAt:desc
router.get('/books', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.read) {
    match.read = req.query.read === 'true'
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    /*const books = await Book.find({})
    res.status(200).send(books)*/

    await req.user.populate({
      path: 'books',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate()
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
  const allowedUpdates = ['author', 'title', 'read'];
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