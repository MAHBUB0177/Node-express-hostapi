const mongoose=require("mongoose")


const backgroundSchema=new mongoose.Schema({ 
    image: { type: String }, 
    createdAt:{
        type:Date,
        default:Date.now()
    },
})


module.exports= mongoose.model('backgroundImg',backgroundSchema)