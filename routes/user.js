const express=require('express');
const router=express.Router()

const { registerUser, loginUser } = require('../controllers/MyUserController');


router.route("/register").post(registerUser);
router.route('/login').post(loginUser);
router.route('/refteshToke').post(registerUser);
router.route('/logout').delete(registerUser);

module.exports=router;