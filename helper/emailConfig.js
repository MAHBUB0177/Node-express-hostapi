require('dotenv').config();
const nodemailer = require('nodemailer');
// Create a transporter object
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: "ma01776879@gmail.com",
        pass: ""
    }
});


module.exports = { transporter };
