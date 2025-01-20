const express=require('express');
const router=express.Router()
const multer = require('multer');
const { registerUser, loginUser, refreshToken, updateUser, deleteUser, currentuserInfo, resetPassword, createMyProfileImage } = require('../controllers/MyUserController');
const verifyToken = require('../middleware/auth');

// Configure Multer storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limit file size to 5 MB
    },
});

router.route("/register").post(registerUser);
router.route('/login').post(loginUser);
router.route('/refreshToken').post(refreshToken);
router.route('/update').put(verifyToken,updateUser);
router.route('/uploadProfile',).post(upload.single('image'),createMyProfileImage)
router.route('/resetPassword').put(verifyToken,resetPassword);
router.route("/delete/:id").delete(verifyToken,deleteUser);
router.route('/currenuserinfo').get(verifyToken,currentuserInfo)

module.exports=router;