const express=require('express');
const router=express.Router()


const {createMyProduct, geatAllProducts} = require('../controllers/itemProduct');


//new added
router.route('/').post(createMyProduct)
router.route('/products').get(geatAllProducts)

module.exports=router;