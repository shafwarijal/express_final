import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const sendEmail = async (email, subject, payload, template) => {
  try {
    const __dirname = fileURLToPath(new URL('.', import.meta.url));

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const templatePath = path.join(__dirname, template);
    const source = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(source);

    const options = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: subject,
      html: compiledTemplate(payload),
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.error(err);
          reject(err); // Reject the promise on error
        } else {
          resolve(info); // Resolve the promise with success info
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error to be caught by the caller
  }
};

export default sendEmail;
