var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'morteza.esmailpoor@gmail.com',
    pass: 'MoGo @132184'
  }
});

var mailOptions = {
  from: 'morteza.esmailpoor@gmail.com',
  to: 'morteza.es218@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

const sendEmail = transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email from sendEmail.js sent: ' + info.response);
  }
});

module.exports = sendEmail;