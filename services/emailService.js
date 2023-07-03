const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    host : "smtp.gmail.com",
    port: 465,
    secure: true,
    auth : {
        user : "pateriyaaashish255@gmail.com",
        pass : 'ojxtfqmmywvzrsyu'
    }
})

const mailOptions = {
    from : "pateriyaaashish255@gmail.com",
    to : "ashupateriya2412@gmail.com",
    subject : "testing for nodemailer",
    body : "Hello !"
}

module.exports = { transporter, mailOptions }