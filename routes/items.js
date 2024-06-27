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
const {createMyProduct, geatAllProducts, updateMyProduct} = require('../controllers/itemProduct');
const verifyToken = require('../middleware/auth');


//new added
router.route('/create',).post(verifyToken,upload.single("imageFile"),createMyProduct)
router.route('/getproducts').get(verifyToken,geatAllProducts)
router.route("/update/:productId").put(verifyToken,upload.single("imageFile"),updateMyProduct)


module.exports=router;