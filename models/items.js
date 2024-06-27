const mongoose=require("mongoose")


const itemsSchema=new mongoose.Schema({
    productName:{
        type:String,
        // required: true
    },
    price:{
        type:Number,
        // required:[true, "price must be provided"]
    },
    featured:{
        type:Boolean,
        default:false
    },
    image: {
        type: String // This will store the URL or path of the uploaded image
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
    //    value:['apple','samsung','dell','mi'],//collection of arry
    //    message:`{value} is not supported.`
    }


})


module.exports= mongoose.model('item',itemsSchema)