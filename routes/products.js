const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST - Add a new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST - Bulk insert (must be before /:id)
router.post('/bulk', async (req, res) => {
  try {
    const products = await Product.insertMany(req.body.products);
    res.status(201).json({
      message: `${products.length} products inserted successfully`,
      products
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET - Analytics (must be before /:id)
router.get('/stats/analytics', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalQuantity: { $sum: '$quantity' },
          maxPrice: { $max: '$price' },
          minPrice: { $min: '$price' }
        }
      },
      { $sort: { totalProducts: -1 } }
    ]);

    const overall = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          averagePrice: { $avg: '$price' },
          totalInventoryValue: { $sum: { $multiply: ['$price', '$quantity'] } }
        }
      }
    ]);

    res.json({
      byCategory: stats,
      overall: overall[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Fetch all products
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      category,
      minPrice,
      maxPrice,
      search
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.name = { $regex: search, $options: 'i' };

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET - Fetch single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH - Update a product
router.patch('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Remove a product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;