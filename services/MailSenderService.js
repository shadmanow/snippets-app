const nodemailer = require('nodemailer');
const config = require('config');

const mailTransport = nodemailer.createTransport( {
  service: 'Yandex',
  auth: {
    user: config.get('yandex_mail.user'),
    pass: config.get('yandex_mail.password')
  }
});

module.exports = function MailSenderService() {
  this.send = (email, subject, text) => {
    return new Promise(async (resolve, reject) => {
      await mailTransport.sendMail({
        from: '"MySnippet" mysnippet@yandex.ru',
        to: email,
        subject: subject,
        html: `<p>${text}</p>`
      }, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else resolve('mail sent');
      });
    });
  }
};

