const swaggerAutoGen = require('swagger-autogen')();
const doc = {
  info: {
    title: 'Users API',
    description: 'users API',
  },
  host: 'cse341-project1-g6sv.onrender.com',
  schema: ['https'],
};
const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

swaggerAutoGen(outputFile, endpointFiles, doc);
