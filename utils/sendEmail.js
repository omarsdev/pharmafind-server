"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (email, code) => {
  console.log("Code: ", code);
  let transporter = nodemailer.createTransport({
    host: "mail.almadinafm.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "omar@almadinafm.com", // generated ethereal user
      pass: "Omar123123", // generated ethereal password
    },
  });
  try {
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"PharmaFind Admin" <omar@almadinafm.com>', // sender address
      to: email || "omarsukarieh99@gmail.com", // list of receivers
      subject: "Verification Code", // Subject line
      text: "Verification Code", // plain text body
      html: `<b>
        <h2>The Verification Code is <h1>${
          code || "23123"
        }</h1> you gonna need it to login</h2>
    </b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {}
};

// main().catch(console.error);

module.exports = sendEmail;
