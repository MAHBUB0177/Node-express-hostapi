

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
