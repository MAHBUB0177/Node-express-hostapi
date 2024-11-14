const mongoose=require("mongoose")


const OrdersSchema=new mongoose.Schema({
    userId :{
        type:String,
        // required: true
    },
    name:{
        type:String,
        required: true
    },
    phoneNumber:{
        type:Number,
        required: true
    },
    houseNo:{
        type:String,
        required: true
    },
    postalCode:{
        type:Number,
        required: true
    },
    division:{
        type:String,
        required: true
     },
    
    city:{
        type:String,
        required: true
    },
    area:{
        type:String,
        required: true
    },
    address:{
        type:String,
        required: true
    }
    ,
    
})

module.exports= mongoose.model('order',OrdersSchema)