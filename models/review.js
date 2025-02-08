const mongoose=require("mongoose")


const reviewSchema=new mongoose.Schema({
    message:{
        type:String,
    },
    rating:{
        type:Number,
    },
    reviewer_name:{
        type:String,
    },
   
    orderedAt:{
        type:Date,
        default:Date.now()
    },
    
   
    image: { type: String },
    productId:{
        type:String,
    }, 
    userId:{
        type:String,
    }

})


module.exports= mongoose.model('review',reviewSchema)