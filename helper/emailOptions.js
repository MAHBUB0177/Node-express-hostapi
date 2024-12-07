

const generateMailOptions = (to, subject, text, html) => {
    const mailOptions= {
        from: 'ma01776879@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html,
       
    };

    return mailOptions;
}


const generateMailOptionsForInvoice = (to, subject, text, html,pdfPath) => {
  const mailOptions= {
      from: 'ma01776879@gmail.com',
      to: to,
      subject: subject,
      text: text,
      attachments: [
          {
            filename: "invoice.pdf",
            path: pdfPath,
          },
        ],
  };

  return mailOptions;
}


module.exports = { generateMailOptions , generateMailOptionsForInvoice};
