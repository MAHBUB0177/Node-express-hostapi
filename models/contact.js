const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // Regex for email validation
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  createdAt:{
    type:Date,
    default:Date.now()
},
message:{
    type: String,
    required: true,
}
});

module.exports = mongoose.model('contact', ContactSchema);