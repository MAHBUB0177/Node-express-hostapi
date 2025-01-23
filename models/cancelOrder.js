const mongoose=require("mongoose")


const cancelOrderSchema=new mongoose.Schema({
    productName:{
        type:String,
    },
    price:{
        type:Number,
    },
    oldprice:{
        type:Number,
    },
    quantity:{
        type:Number
    },
    orderedAt:{
        type:Date,
        default:Date.now()
    },
    brand:{
       type:String,

    },
    category:{
        type:String,
    },
    color:{
        type:String,
    },
    userId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
   
   
  
    image: [{ type: String }], 
    rating:{
        type:Number,
        default:5.9
    },



})


module.exports= mongoose.model('cancelmOrders',cancelOrderSchema)