const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getAllUsers = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Endpoint to get all users'
  // #swagger.responses[200] = { description: 'Successfully retrieved all users' }
  // #swagger.responses[500] = { description: 'Failed to retrieve users' }
  try {
    const result = await mongodb.getDb().collection('users').find();
    const users = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
};

const getSingleUser = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Endpoint to get a single user by ID'
  // #swagger.parameters['id'] = { description: 'User ID' }
  // #swagger.responses[200] = { description: 'Successfully retrieved user' }
  // #swagger.responses[500] = { description: 'Failed to retrieve user' }
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('users').findOne({ _id: userId });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user', error });
  }
};

const createUser = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Endpoint to create a new user'
  // #swagger.parameters['body'] = { in: 'body', description: 'User data', schema: { name: 'string', email: 'string', password: 'string' } }
  // #swagger.responses[201] = { description: 'User created successfully' }
  // #swagger.responses[400] = { description: 'Name, email, and password are required' }
  // #swagger.responses[500] = { description: 'Failed to create user' }
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const newUser = { name, email, password };
    const result = await mongodb.getDb().collection('users').insertOne(newUser);
    if (result.acknowledged) {
      res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } else {
      res.status(500).json({ message: 'Failed to create user' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error });
  }
};

const updateUser = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Endpoint to update an existing user'
  // #swagger.parameters['id'] = { description: 'User ID' }
  // #swagger.parameters['body'] = { in: 'body', description: 'Updated user data', schema: { name: 'string', email: 'string', password: 'string' } }
  // #swagger.responses[200] = { description: 'User updated successfully' }
  // #swagger.responses[400] = { description: 'Invalid user ID format or no updates provided' }
  // #swagger.responses[404] = { description: 'User not found or no changes made' }
  // #swagger.responses[500] = { description: 'Failed to update user' }
  try {
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const updates = req.body;
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No updates provided' });
    }

    const validFields = ['name', 'email', 'password'];
    const invalidFields = Object.keys(updates).filter((field) => !validFields.includes(field));
    if (invalidFields.length > 0) {
      return res.status(400).json({ message: `Invalid fields in update: ${invalidFields.join(', ')}` });
    }

    const result = await mongodb
      .getDb()
      .collection('users')
      .updateOne({ _id: new ObjectId(userId) }, { $set: updates });
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ message: 'User not found or no changes made' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Endpoint to delete a user by ID'
  // #swagger.parameters['id'] = { description: 'User ID' }
  // #swagger.responses[200] = { description: 'User deleted successfully' }
  // #swagger.responses[404] = { description: 'User not found' }
  // #swagger.responses[500] = { description: 'Failed to delete user' }
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('users').deleteOne({ _id: userId });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error });
  }
};

module.exports = { getAllUsers, getSingleUser, createUser, updateUser, deleteUser };
