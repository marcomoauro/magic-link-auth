import nodemailer from 'nodemailer';
import log from "../log.js";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASSWORD
  }
});

const sendMail = async ({email, subject, body}) => {
  log.info('Mailer::sendMail', {email, body});

  const response = await transporter.sendMail({
    from: process.env.MAILER_USER, // sender address
    to: email, // list of receivers
    subject, // Subject line
    text: body, // plain text body
    //html: "<b>Hello world?</b>", // html body
  });

  log.info('Mailer::sendMail', {response})
}

export default sendMail;
