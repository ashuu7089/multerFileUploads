const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service : "gmail",
    auth : {
        user : "pateriyaaashish255@gmail.com",
        pass : 'ygknxookwmbkkylv'
    }
})

const mailOptions = {
    from : "pateriyaaashish255@gmail.com",
    to : "ashupateriya2412@gmail.com",
    subject : "testing for nodemailer",
    body : "Hello !"
}

module.exports = { transporter, mailOptions }