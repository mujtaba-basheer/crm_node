const nodemailer = require("nodemailer");

const sendMail = async ({ email = [], subject, body }, res) => {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    const info = await transporter.sendMail({
        from: '"DesireCoupons" <desirecoupons2020@gmail.com>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: body, // plain text body
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.status(200).json({
        previewUrl: nodemailer.getTestMessageUrl(info),
    });
};

module.exports = sendMail;
