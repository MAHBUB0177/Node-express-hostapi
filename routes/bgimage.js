const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createMyBgImage } = require('../controllers/MybackgroundController');
const verifyToken = require('../middleware/auth');

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5 MB
    },
});

// Route for single image upload
router.post('/create', verifyToken, upload.single("imageFile"), createMyBgImage);

module.exports = router;
