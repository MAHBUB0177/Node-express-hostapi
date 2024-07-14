require("dotenv").config()
const connectDB= require('./db/connect')
 const Product =require('./models/product')
 const Items =require('./models/items')
 const User=require('./models/user')
 const ProductJson =require('./products.json')
 const ItemJson =require('./items')

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

 const itemscreate=async ()=>{
    try {
        await connectDB(process.env.MONGODB_URI);
        await Items.deleteMany()//remove previous data and when call this function only new collection is added to data base
        // await Items.create(ItemJson)
        console.log('success item')
    } catch (error) {
        console.log(error);
    }
 } 
 itemscreate()

 const user =async ()=>{
    try {
        await connectDB(process.env.MONGODB_URI);
        await User.create({email:'mralam@email.com',name:'MahbubAlam',password:'12345001'})
        console.log('success')
    } catch (error) {
        console.log(error);
    }
 } 

 user()