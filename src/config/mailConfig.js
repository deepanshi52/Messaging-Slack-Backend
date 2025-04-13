import nodemailer from 'nodemailer';

import { MAIL_ID, MAIL_PASSWORD } from './serverConfig.js';

// Debug logging
// console.log('Mail Configuration:', {
//     user: MAIL_ID,
//     hasPassword: !!MAIL_PASSWORD,
//     passwordLength: MAIL_PASSWORD ? MAIL_PASSWORD.length : 0
// });

export default nodemailer.createTransport({
    service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: MAIL_ID,
    pass: MAIL_PASSWORD,
  },

});


