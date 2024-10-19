const mongoose=require("mongoose")


const confirmOrderSchema=new mongoose.Schema({
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
    }


})


module.exports= mongoose.model('confirmOrders',confirmOrderSchema)