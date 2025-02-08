const express=require('express');
const router=express.Router()

const { CreateMyReview, geatReviewById, geatReviewByuserId } = require('../controllers/MyReviewController');
const verifyToken = require('../middleware/auth');



router.route('/create').post(CreateMyReview);
router.route('/fetchById').get(geatReviewById);
router.route('/fetchByUserId').get(verifyToken,geatReviewByuserId);


module.exports=router;