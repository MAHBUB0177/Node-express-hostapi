require("dotenv").config()
const express=require("express")
const morgan = require('morgan')
const app=express()
const cors = require('cors');
const connectDB=require("./db/connect")
const products_routes = require('./routes/products')
const user_routes = require('./routes/user')
const client = require('./helper/init_redis');



app.use(morgan('dev'))
app.use(express.json());
app.use(cors());

const PORT =process.env.PORT || 500 ;
app.get('/', (req,res)=>{
res.send('Hi, I Am Live')
});

//product routes
app.use('/api/products',products_routes)
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