const mongoose=require("mongoose")
const bcrypt = require('bcrypt');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})


// //To perform an action before a document is saved (e.g., hashing a password):
// userSchema.pre('save', async function (next) {
//     // const user = this;
  
//     if (this.isModified('password') || this.isNew) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         // user.password = await bcrypt.hash(user.password, salt);
//         const hashedPassword=await bcrypt.hash(this.password, salt);
//         this.password=hashedPassword
//         next();
//       } catch (err) {
//         next(err);
//       }
//     } else {
//       next();
//     }
//   });

module.exports= mongoose.model('User',userSchema)