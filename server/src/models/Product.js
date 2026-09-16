const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price must be positive'],
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Tops', 'Bottoms', 'Shoes', 'Accessories'],
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['Active', 'Draft'],
      default: 'Active',
    },
    image: {
      type: String,
      required: [true, 'Product image is required'],
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ title: 'text', category: 1, status: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = mongoose.model('Product', productSchema);