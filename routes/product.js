const express = require('express');
const { Product } = require('../models');
const { sequelize } = require('../models');
const axios = require('axios');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: The description of the product
 *         userId:
 *           type: integer
 *           description: The id of the user who created the product
 *       example:
 *         id: 1
 *         name: Product 1
 *         description: This is product 1
 *         userId: 1
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Some server error
 */
router.post('/products', async (req, res) => {
    try {
      const userId = req.body.userId;
      const userResponse = await axios.get(`http://localhost:3002/api/users/${userId}`);
      if (userResponse.data) {
        const product = await Product.create(req.body);
        res.status(201).json(product);
      } else {
        res.status(400).json({ error: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  });
  

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get the product by id
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product id
 *     responses:
 *       200:
 *         description: The product description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: The product was not found
 */
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

/**
 * @swagger
 * /products/user/{userId}:
 *   get:
 *     summary: Get products by user id
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: List of products created by the user
 *         contents:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No products found for this user
 */
router.get('/products/user/:userId', async (req, res) => {
  try {
    const products = await Product.findAll({ where: { userId: req.params.userId } });
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ error: 'No products found for this user' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

module.exports = router;
