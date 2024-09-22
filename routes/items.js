const express=require('express');
const router=express.Router()
const multer = require('multer');
const {createMyProduct, geatAllProducts, updateMyProduct, fetchProductById, getRelatedProducts} = require('../controllers/itemProduct');
const verifyToken = require('../middleware/auth');

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});

//new added
router.route('/create',).post(verifyToken,upload.array("imageFile",10),createMyProduct)
router.route('/getproducts').get(geatAllProducts)
router.route("/fetch/:id").get(fetchProductById);
router.route('/getRelatedProducts').get(getRelatedProducts)
router.route("/update/:productId").put(verifyToken,upload.single("imageFile",10),updateMyProduct)


module.exports=router;