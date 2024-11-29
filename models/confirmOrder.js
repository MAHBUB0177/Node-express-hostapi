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
    },
    shippingFee:{
        type:Number,
        required:true
    },
    grandTotal:{
        type:Number,
        required:true
    },
    shippingUserName:{
        type:String,
        required:true
    },
    shippingPhone:{
        type:Number,
        required:false
    },
    shippingHouseNo:{
        type:String,
        required:true
    },
    shippingCity:{
        type:String,
        required:true
    },



})


module.exports= mongoose.model('confirmOrders',confirmOrderSchema)