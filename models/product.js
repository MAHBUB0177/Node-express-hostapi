const mongoose=require("mongoose")


const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    price:{
        type:Number,
        required:[true, "price must be provided"]
    },
    featured:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Number,
        default:5.9
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    company:{
       type:String,
       value:['apple','samsung','dell','mi'],//collection of arry
       message:`{value} is not supported.`
    }


})


module.exports= mongoose.model('product',productSchema)