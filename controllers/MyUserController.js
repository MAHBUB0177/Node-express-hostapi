const User =require('../models/user')
import jwt from 'jsonwebtoken';

const registerUser=async(req,res)=>{
    console.log('user created')
    const{email,name,password}=req.body;
   
    try{
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
    const {email,password}=req.body;
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