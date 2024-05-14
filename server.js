const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
if (process.env.NODE_ENV === 'development' || true) {
  // this is for class, so its always true, but we cn conditionaly lock this for developments
  const swaggerUi = require('swagger-ui-express');
  const swaggerDocument = require('./swagger.json');

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

const mongodb = require('./data/database');

// Middleware to parse JSON
app.use(bodyParser.json());

// CORS Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});
// Routing
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3000;

// Start server only after MongoDB connection is successful
mongodb.initDb((err) => {
  if (err) {
    console.error('MongoDB connection error:', err);
  } else {
    app.listen(PORT, () => {
      console.log(`Database is connected and server is running on port ${PORT}`);
    });
  }
});
