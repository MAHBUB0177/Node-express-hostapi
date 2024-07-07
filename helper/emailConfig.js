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
         user: 'trystan.hettinger58@ethereal.email',
        pass: 'GMBhedXCcNK5pm8FdX'
    }
});


module.exports = { transporter };
