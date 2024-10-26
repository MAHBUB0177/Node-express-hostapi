const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  createdAt:{
    type:Date,
    default:Date.now()
}
});

module.exports = mongoose.model('brand', BrandSchema);