const express=require('express');
const router=express.Router()

const { registerUser, loginUser, refreshToken, updateUser, deleteUser, currentuserInfo } = require('../controllers/MyUserController');
const verifyToken = require('../middleware/auth');


router.route("/register").post(registerUser);
router.route('/login').post(loginUser);
router.route('/refreshToken').post(refreshToken);
router.route('/update').put(verifyToken,updateUser);
router.route("/delete/:id").delete(deleteUser);
router.route('/currenuserinfo').get(verifyToken,currentuserInfo)

module.exports=router;