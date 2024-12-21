const express=require('express');
const { CreateMyContact } = require('../controllers/myContactController');
const router=express.Router()



router.route('/create').post(CreateMyContact);


module.exports=router;