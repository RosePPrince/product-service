require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { swaggerUi } = require('./swagger');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDocs = swaggerJsDoc(swaggerOptions);
const productRoutes = require('./routes/product');
app.use('/api', productRoutes);

const app = express();
app.use(bodyParser.json());
const { sequelize } = require('./models');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Service API',
      version: '1.0.0',
      description: 'API documentation for Product Service'
    },
  },
  apis: ['./routes/*.js'],
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

swaggerSetup(app);

const PORT = process.env.PORT || 3002;
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Product Service running on port ${PORT}`));
  });
  