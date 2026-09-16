
const Product = require('../models/Product.js');


// @desc    Get all products with filtering & search
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search, status } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPrice,
      stock,
      category,
      sizes,
      colors,
      status,
      image,
    } = req.body;

    const product = await Product.create({
      title,
      description,
      price,
      discountPrice,
      stock,
      category,
      sizes,
      colors,
      status: status ? 'Active' : 'Draft',
      image,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update existing product
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};