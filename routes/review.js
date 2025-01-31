const express=require('express');
const router=express.Router()

const { CreateMyReview, geatReviewById } = require('../controllers/MyReviewController');



router.route('/create').post(CreateMyReview);
router.route('/fetchById').get(geatReviewById);


module.exports=router;