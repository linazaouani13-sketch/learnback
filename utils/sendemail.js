const nodemailer = require('nodemailer');

// Create connection to Gmail's mail server
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Reusable function to send an email
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"LearnBack" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
