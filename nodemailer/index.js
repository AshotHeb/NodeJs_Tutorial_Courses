const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 993,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'heboyanashot@gmail.com',
        pass: 'ashnar1999'
    }
}, {
    from: 'Ashot Heboyan <heboyanashot@gmail.com>'
});


const mailer = message => {
    transporter.sendMail(message, (err, info) => {
        console.log('Err'+ err);
        if (err) return err;
        console.log('Email sent :', info);
    })
}

module.exports = mailer;