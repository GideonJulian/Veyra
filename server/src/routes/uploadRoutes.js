const express = require('express');
const { upload } = require('../middleware/upload.js');

const router = express.Router();

// POST /api/upload
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image uploaded' });
  }

  // Construct accessible image URL
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    imageUrl,
  });
});

module.exports = router;