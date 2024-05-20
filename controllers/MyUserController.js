const User =require('../models/user')

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

registerUser()