require("dotenv").config()
const connectDB= require('./db/connect')
 const Product =require('./models/product')
 const ProductJson =require('./products.json')

 const start =async ()=>{
    try {
        await connectDB(process.env.MONGODB_URI);
        await Product.deleteMany()//remove previous data and when call this function only new collection is added to data base
        await Product.create(ProductJson)
        console.log('success')
    } catch (error) {
        console.log(error);
    }
 } 

 start()