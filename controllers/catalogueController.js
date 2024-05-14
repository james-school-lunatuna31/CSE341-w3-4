const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getAllBooks = async (req, res) => {
  // #swagger.tags = ['Catalogue']
  // #swagger.description = 'Endpoint to get all books'
  // #swagger.responses[200] = { description: 'Successfully retrieved all books' }
  // #swagger.responses[500] = { description: 'Failed to retrieve books' }
  try {
    const result = await mongodb.getDb().collection('catalogue').find();
    const books = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(
      books.map((book) => ({
        _id: book._id,
        ISBN: book.ISBN,
        title: book.title,
        releaseYear: book.releaseYear,
      })),
    );
  } catch (error) {
    console.error('Failed to retrieve books:', error);
    res.status(500).json({ message: 'Failed to retrieve books', error: error.toString() });
  }
};

const getSingleBook = async (req, res) => {
  // #swagger.tags = ['Catalogue']
  // #swagger.description = 'Endpoint to get a single book by ID'
  // #swagger.parameters['id'] = { description: 'Book ID' }
  // #swagger.responses[200] = { description: 'Successfully retrieved book' }
  // #swagger.responses[500] = { description: 'Failed to retrieve book' }
  try {
    const bookId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('catalogue').findOne({ _id: bookId });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      id: result._id,
      ISBN: result.ISBN,
      title: result.title,
      releaseYear: result.releaseYear,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve book', error });
  }
};

const createBook = async (req, res) => {
  // #swagger.tags = ['Catalogue']
  // #swagger.description = 'Endpoint to create a new book'
  // #swagger.parameters['body'] = { in: 'body', description: 'Book data', schema: { ISBN: 'string', title: 'string', releaseYear: 'number' } }
  // #swagger.responses[201] = { description: 'Book added successfully' }
  // #swagger.responses[400] = { description: 'ISBN, title, and release year are required' }
  // #swagger.responses[500] = { description: 'Failed to add book' }
  try {
    const { ISBN, title, releaseYear } = req.body;

    if (!ISBN || !title || !releaseYear) {
      return res.status(400).json({ message: 'ISBN, title, and release year are required' });
    }

    const newBook = { ISBN, title, releaseYear };
    const result = await mongodb.getDb().collection('catalogue').insertOne(newBook);
    if (result.acknowledged) {
      res.status(201).json({ message: 'Book added successfully', bookId: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to add book' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to add book', error });
  }
};

const updateBook = async (req, res) => {
  // #swagger.tags = ['Catalogue']
  // #swagger.description = 'Endpoint to update an existing book'
  // #swagger.parameters['id'] = { description: 'Book ID' }
  // #swagger.parameters['body'] = { in: 'body', description: 'Updated book data', schema: { ISBN: 'string', title: 'string', releaseYear: 'number' } }
  // #swagger.responses[200] = { description: 'Book updated successfully' }
  // #swagger.responses[400] = { description: 'Invalid book ID format or no updates provided' }
  // #swagger.responses[404] = { description: 'Book not found or no changes made' }
  // #swagger.responses[500] = { description: 'Failed to update book' }
  try {
    const bookId = req.params.id;
    if (!ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }

    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    const validFields = ['ISBN', 'title', 'releaseYear'];
    const invalidFields = Object.keys(updates).filter((field) => !validFields.includes(field));
    if (invalidFields.length > 0) {
      return res.status(400).json({ message: `Invalid fields in update: ${invalidFields.join(', ')}` });
    }

    const result = await mongodb
      .getDb()
      .collection('catalogue')
      .updateOne({ _id: new ObjectId(bookId) }, { $set: updates });
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'Book updated successfully' });
    } else {
      res.status(404).json({ message: 'Book not found or no changes made' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book', error: error.message });
  }
};

const deleteBook = async (req, res) => {
  // #swagger.tags = ['Catalogue']
  // #swagger.description = 'Endpoint to delete a book by ID'
  // #swagger.parameters['id'] = { description: 'Book ID' }
  // #swagger.responses[200] = { description: 'Book deleted successfully' }
  // #swagger.responses[404] = { description: 'Book not found' }
  // #swagger.responses[500] = { description: 'Failed to delete book' }
  try {
    const bookId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('catalogue').deleteOne({ _id: bookId });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'Book deleted successfully' });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error });
  }
};

module.exports = { getAllBooks, getSingleBook, createBook, updateBook, deleteBook };
