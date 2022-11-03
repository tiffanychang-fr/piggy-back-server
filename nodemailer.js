require("dotenv").config();
const nodemailer = require("nodemailer");
const emailMessage = ` <body>
<h1>Congratulations you have a response 😁!</h1>
<p>
  Hello you have received a response from (local/username) on your post see
  below the reaction.
</p>
<div>
  <p>
    Hi this is piccolo. I have seen your request and I can help you with
    this. Please feel free to get in contact with me. Hope to see you seen.
    Greetings, Piccolo
  </p>
</div>
<p>Send by nodemailer</p>
</body>`;

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // create reusable transporter object using the default SMTP transport

  //!TESTING TRANSPORTER
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: process.env.TEST_USER_EMAIL,
  //     pass: process.env.TEST_USER_PW,
  //   },
  // });

  //!TEST SEND EMAIL
  // send mail with defined transport object
  // let info = await transporter.sendMail({
  //   from: '"Piggy Back 👻" <foo@example.com>', // sender address
  //   to: "bar@example.com, baz@example.com", // list of receivers
  //   subject: "PiggyBack ✔", // Subject line
  //   text: emailMessage.replace(/<[^>]*>/g, ""), // plain text body
  //   html: emailMessage, // html body
  // });

  //? PRODUCTION TRANSPORTER:
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.PROD_USER_EMAIL,
      pass: process.env.PROD_USER_PW,
    },
  });

  //? PRODUCTION SEND EMAIL
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Gmail Piggy Back 📧" <piggyback611@gmail.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "PiggyBack✔", // Subject line
    text: emailMessage.replace(/<[^>]*>/g, ""), // plain text body
    html: emailMessage, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
}

main().catch(console.error);
