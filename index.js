require("dotenv").config()
const express=require("express")
const morgan = require('morgan')
const app=express()
const cors = require('cors');
const connectDB=require("./db/connect")
const background_routes = require('./routes/bgimage')
const products_routes = require('./routes/products')
const items_routes=require('./routes/items')
const user_routes = require('./routes/user')
const order_route =require('./routes/orders')
const contact_route =require('./routes/contact')
const review_route =require('./routes/review')
const client = require('./helper/init_redis');

app.use(morgan('dev'))
app.use(express.json());
app.use(cors());

const PORT =process.env.PORT || 500 ;
app.get('/', (req,res)=>{
res.send('Hi, I Am Live')
});

//product routes
app.use('/api/bgimage',background_routes)
app.use('/api/products',products_routes)
app.use('/api/items',items_routes)
app.use('/api/cart',order_route)
app.use('/api/contact',contact_route)
app.use('/api/review',review_route)
//authentication routes
app.use('/api/user',user_routes)
const start=async() =>{
    try{
        await connectDB(process.env.MONGODB_URI)
    app.listen(PORT, ()=>{
      console.log(`${PORT} Yes I Am Connected`)
    })
    }
    catch(error){
        console.log(error)
    }
}
start()