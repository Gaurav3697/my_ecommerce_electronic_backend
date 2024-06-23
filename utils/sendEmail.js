//I just shifted port
const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({ 
        host: "smtp.gmail.com", //from video
        port: process.env.SMPT_PORT, //if din't work set the port directly
        service: process.env.SMPT_SERVICE,
          auth: {
             user: process.env.SMPT_MAIL, 
             pass: process.env.SMPT_PASSWORD 
            }, 
        });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;