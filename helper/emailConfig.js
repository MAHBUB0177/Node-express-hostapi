require('dotenv').config();
const nodemailer = require('nodemailer');
// Create a transporter object
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // Use your email provider
//     auth: {
//         user: "ma01776879@gmail.com",
//         pass: ""
//     }
// });

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'katarina.windler72@ethereal.email',
        pass: '4CtJxAp8rwTYCAPG9M'
    }
});


module.exports = { transporter };
