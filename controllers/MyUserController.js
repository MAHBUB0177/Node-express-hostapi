const User =require('../models/user')
const jwt = require('jsonwebtoken');

const registerUser=async(req,res)=>{
    console.log('user created')

    // Check if request body is empty
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ isSuccess: false, message: 'Request body is empty' });
    }
    const{email,name,password}=req.body;
   
    try{
         // Check if email, name, and password are present in the request body
         if (!email || !name || !password) {
            return res.status(400).json({ isSuccess: false, message: 'Email, name, or password is missing in the request body' });
        }
        const existingEmail=await User.findOne({email})
        if(existingEmail){
            return res.status(201).json({isSuccess:false,message:'User Is Alredy Registered'})
        }
         
        const user=new User({email:'mahbub@email.com',name:'mahbub',password:'12345'})
        await User.bulkSave()
        return res.status(200).json({isSuccess:true,message:'User Registered Successfully'})
    }
    catch{
    return res.status(500).json({ isSuccess: false, error: error, message: 'Registration failed' });
    }

}

//calculate access token expiration time
const tokenExpiration=new Date();
tokenExpiration.setHours(tokenExpiration.getHours() + 1)

//calculate refresh token expiration time
const refreshTokenExpiration = new Date();
refreshTokenExpiration.setHours(refreshTokenExpiration.getHours() + 48)


const loginUser=async(req,res)=>{
    console.log('call i am')
    const {email,password}=req.body;
    console.log(email.password,'124789')
    try{
    const user=await User.findOne({email,password})
    if(!user){
        res.status(201).json({isSuccess:false,error:'Authentication Failed',message:'Email or password is wrong'})
    }
    
    if (!password) {
        return res.status(401).json({ isSuccess: false, error: 'Authentication failed', message: 'Email or password is wrong' });
      }
      const accessToken=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn: '1h',})
      const refreshToken=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn: '2d',})
      res.status(200).json({isSuccess:true,data:{accessToken,refreshToken,tokenExpiration,refreshTokenExpiration,user},message:'Successfully login'})
    }
    catch(error){
        res.status(500).json({ isSuccess: false, error: error, message: 'Authentication failed' });
    }


}
module.exports={registerUser,loginUser}