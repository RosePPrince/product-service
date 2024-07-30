const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, Product } = require('../models');
const productRoutes = require('../routes/product');
const axios = require('axios');


const app = express();
app.use(bodyParser.json());
app.use('/api', productRoutes);

jest.mock('axios');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Product API', () => {
  it('should create a new product', async () => {
    axios.get.mockResolvedValue({ data: { id: 1, name: 'John Doe' } });

    const res = await request(app)
      .post('/api/products')
      .send({
        name: 'Product 1',
        description: 'This is product 1',
        userId: 1,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should get a product by ID', async () => {
    const product = await Product.create({
      name: 'Product 2',
      description: 'This is product 2',
      userId: 1,
    });
    const res = await request(app).get(`/api/products/${product.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Product 2');
  });

  it('should get products by user ID', async () => {
    const userId = 1;
    await Product.create({
      name: 'Product 3',
      description: 'This is product 3',
      userId,
    });
    const res = await request(app).get(`/api/products/user/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
