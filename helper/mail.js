const nodemailer = require("nodemailer");

const sendMail = async ({ email, subject, body }, res) => {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
            // user: process.env.EMAIL_ID,
            // pass: process.env.EMAIL_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"DesireCoupons" <mujtababasheer14@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: body, // plain text body
        });

        console.log("Message sent: %s", info.messageId);

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.status(200).json({
            previewUrl: nodemailer.getTestMessageUrl(info),
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ mailSent: "false" });
    }
};

module.exports = sendMail;
