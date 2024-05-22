const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URL;
let _db;

const initDb = (callback) => {
  if (_db) {
    console.warn('Trying to init DB again!');
    return callback(null, _db);
  }
  MongoClient.connect(uri)
    .then((client) => {
      _db = client.db();
      console.log('Database connected successfully');
      callback(null, _db);
    })
    .catch((err) => {
      console.error('Database connection error:', err);
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error('Database not initialized');
  }
  return _db;
};

const getUserById = async (id, done) => {
  console.log(`Attempting to fetch user with ID: ${id}`);
  try {
    const db = getDb();
    const collection = db.collection('users');
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      console.log('No user found with the given ID.');
    } else {
      console.log('User fetched successfully:', user);
    }
    done(null, user);
  } catch (err) {
    console.error('Error fetching user:', err);
    done(err);
  }
};

module.exports = {
  initDb,
  getDb,
  getUserById,
};
