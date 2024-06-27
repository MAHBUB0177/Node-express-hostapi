const express=require('express');
const router=express.Router()

const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});
const {createMyProduct, geatAllProducts} = require('../controllers/itemProduct');


//new added
router.route('/create',).post(upload.single("imageFile"),createMyProduct)
router.route('/products').get(geatAllProducts)

module.exports=router;