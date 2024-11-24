require('dotenv').config();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'ma01776879@gmail.com',
        pass: 'mexl blzh ivrt wawa'
    }
});
module.exports = { transporter };
