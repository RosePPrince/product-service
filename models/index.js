const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const axios = require('axios');

const { Sequelize, DataTypes } = require('sequelize');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME || 'product_service_db',
  process.env.DB_USER || 'microservice_user',
  process.env.DB_PASS || 'Rose',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Product = require('./product')(sequelize, Sequelize);

module.exports = db;

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

sequelize.sync();

const app = express();
const port = process.env.PORT || 3002;
app.use(bodyParser.json());

// Load OpenAPI documentation
const swaggerDocument = yaml.load(fs.readFileSync('./api-docs.yml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mock database
let products = {};

// POST /products - Create a new product
app.post('/products', async (req, res) => {
    const { id, name, userId } = req.body;
    if (!id || !name || !userId) {
        return res.status(400).json({ message: 'Product ID, name, and user ID are required' });
    }
    if (products[id]) {
        return res.status(400).json({ message: 'Product already exists' });
    }

    // Fetch user information
    try {
        const userResponse = await axios.get(`http://localhost:3002/users/${userId}`);
        if (userResponse.status !== 200) {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(404).json({ message: 'User not found' });
    }

    products[id] = { id, name, userId };
    res.status(201).json(products[id]);
});

app.get('/products/:id', (req, res) => {
    const product = products[req.params.id];
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
});

app.get('/products/user/:userId', (req, res) => {
    const userProducts = Object.values(products).filter(product => product.userId === req.params.userId);
    res.status(200).json(userProducts);
});


app.listen(port, () => {
    console.log(`Product Service listening on port ${port}`);
});
