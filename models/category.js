const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdAt:{
    type:Date,
    default:Date.now()
}
});

module.exports = mongoose.model('category', CategorySchema);