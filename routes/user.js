const express=require('express');
const router=express.Router()

const { registerUser, loginUser, refreshToken, updateUser, deleteUser, currentuserInfo, resetPassword } = require('../controllers/MyUserController');
const verifyToken = require('../middleware/auth');


router.route("/register").post(registerUser);
router.route('/login').post(loginUser);
router.route('/refreshToken').post(refreshToken);
router.route('/update').put(verifyToken,updateUser);
router.route('/resetPassword').put(verifyToken,resetPassword);
router.route("/delete/:id").delete(verifyToken,deleteUser);
router.route('/currenuserinfo').get(verifyToken,currentuserInfo)

module.exports=router;