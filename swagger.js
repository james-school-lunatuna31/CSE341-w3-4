const swaggerAutoGen = require('swagger-autogen')();
const doc = {
  info: {
    title: 'Users API',
    description: 'users API',
  },
  host: 'localhost:8080',
  schema: ['https'],
};
const outputFile = './swagger.json';
const endpointFiles = ['./routes/index.js'];

swaggerAutoGen(outputFile, endpointFiles, doc);
