const express=require('express');
const router=express.Router()

const { registerUser, loginUser, refreshToken, deleteMyUser, updateUser } = require('../controllers/MyUserController');
const verifyToken = require('../middleware/auth');


router.route("/register").post(registerUser);
router.route('/login').post(loginUser);
router.route('/refreshToken').post(refreshToken);
router.route('/delete').delete(deleteMyUser);
router.route('/update').put(verifyToken,updateUser);//Use the verifyToken middleware in the route that handles user updates.

module.exports=router;