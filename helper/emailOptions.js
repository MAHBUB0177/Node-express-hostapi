

const generateMailOptions = (to, subject, text, html,pdfPath) => {
    const mailOptions= {
        from: 'ma01776879@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html,
        attachments: [
            {
              filename: "invoice.pdf",
              path: pdfPath,
            },
          ],
    };

    return mailOptions;
}


module.exports = { generateMailOptions };
