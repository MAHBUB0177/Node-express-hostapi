const express=require('express');
const router=express.Router()

const { registerUser, loginUser, refreshToken } = require('../controllers/MyUserController');


router.route("/register").post(registerUser);
router.route('/login').post(loginUser);
// router.route('/refreshToken').post(refreshToken);
router.route('/logout').delete(registerUser);

module.exports=router;