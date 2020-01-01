const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'library';

MongoClient.connect(connectionURL, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('Unable to connect')
  }

  console.log('connected')

  const db = client.db(databaseName);

  db.collection('library').findOne({author: 'Andrei mm'}, (error, book) => {
    if (error) {
      return console.log('Unable to fetch')
    }

    console.log(book)
  })

  db.collection('library').find({author: 'Andrei'}).toArray((error, books) => {
    if (error) {
      return console.log('Unable to fetch')
    }

    console.log(books)
  })

  db.collection('library').find({author: 'Andrei'}).count((error, count) => {
    if (error) {
      return console.log('Unable to fetch')
    }

    console.log(count)
  })

  db.collection('library').updateOne({
    _id: new ObjectID('5e024936b80c6c248cc39610')
  },{
    $set: {
      name: 'Max'
    }
  }).then(result => {
    console.log(result)
  }).catch(error => {
    console.log(error)
  })
})