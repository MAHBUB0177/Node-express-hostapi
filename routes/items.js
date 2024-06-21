const express=require('express');
const router=express.Router()


const {createMyProduct} = require('../controllers/itemProduct');


//new added
router.route('/').post(createMyProduct)

module.exports=router;