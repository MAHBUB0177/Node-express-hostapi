require("dotenv").config()
const connectDB= require('./db/connect')
 const Product =require('./models/product')
 const User=require('./models/user')
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


 const user =async ()=>{
    try {
        await connectDB(process.env.MONGODB_URI);
        await User.create({email:'mr@email.com',name:'MahbubAlam',password:'1234500'})
        console.log('success')
    } catch (error) {
        console.log(error);
    }
 } 

 user()