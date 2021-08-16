const nodemailer = require('nodemailer');

const sendEmail = async (params) => {
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //mail options
  const mailOptions = {
    from: 'Emmanuel Akomaning <noreply@duixe.io>',
    to: params.email,
    subject: params.subject,
    text: params.message,
  };

  //send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
