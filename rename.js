require("dotenv").config()
const mongoose = require('mongoose');
const connectDB= require('./db/connect')
const Items =require('./models/items')


// Connect to your MongoDB
// mongoose.connect('mongodb://localhost:27017/yourDatabase', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

const addNewField = async () => {
    await connectDB(process.env.MONGODB_URI);
  await Items.updateMany({}, { $rename: { company: 'brand' } });
    console.log('New field added to all documents');
};

addNewField().then(() => mongoose.disconnect());
