const mongoose=require("mongoose")


const shopsSchema=new mongoose.Schema({
    shopName:{
        type:String,
        required: true
    },
    description:{
        type:String,
        // required: true
    },
    category:{
        type:String,
    },
    image: [{ type: String }],  
    rating:{
        type:Number,
        default:5.9
    },
    followers:{
        type:String,
     },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    address:{
        type:String
    },
    delivery_date:{
        type:String
    }

   



})


module.exports= mongoose.model('shop',shopsSchema)