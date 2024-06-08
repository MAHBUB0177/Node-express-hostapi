

// const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: 'recipient-email@example.com',
//     subject: 'Hello from Node.js',
//     text: 'Hello world?',
//     html: '<b>Hello world?</b>'
// };

// transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//         return console.log(error);
//     }
//     console.log('Message sent: %s', info.messageId);
// });

const generateMailOptions = (to, subject, text, html) => {
    const mailOptions= {
        from: 'ma01776879@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    return mailOptions;
}


module.exports = { generateMailOptions };
