const nodemailer = require("nodemailer");

exports.sendMail = async function ({ to, subject, text, url }) {
  const transporter = await nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS, // generated ethereal password
    },
  });
  const message = {
    from: "dineshchandrasekaren@gmail.com",
    to,
    subject,
    text,
    html: `<a style="background-color:blue;color:white;border-radius:30px;padding: 10px " href=${url}>Click here to Reset Password</a>`,
  };
  // send mail with defined transport object
  await transporter.sendMail(message);
};

exports.updatePassword = async (req, res, next) => {};
