require("dotenv").config()
const express=require("express")
const morgan = require('morgan')
const app=express()
const connectDB=require("./db/connect")
const products_routes = require('./routes/products')
const user_routes = require('./routes/user')
const client = require('./helper/init_redis');
// client.set('name', 'mahbub', (err) => {
//     if (err) {
//         console.error('Error setting value:', err.message);
//     } else {
//         console.log('Value set successfully');

//         client.get('name', (err, value) => {
//             if (err) {
//                 console.error('Error getting value:', err.message);
//             } else {
//                 console.log('Value:', value);
//             }
//         });
//     }
// });


app.use(morgan('dev'))
app.use(express.json());

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