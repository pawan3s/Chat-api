const nodemailer = require("nodemailer");

const sendEmail = async (object) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.NODE_HOST_EMAIL,
      pass: process.env.NODE_HOST_PASSWORD,
    },
  });

  const mailOptions = {
    from: "lets chat with me <noreply@haminepal.org>",
    to: object.email,
    subject: object.subject,
    text: object.message,
  };

  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
