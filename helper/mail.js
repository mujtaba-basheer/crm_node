const nodemailer = require("nodemailer");

const { createLogger, format, transports } = require("winston");
const { combine, prettyPrint, timestamp } = format;
const logger = createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [new transports.Console()],
});

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

        logger.log({
            level: "info",
            message: "Message sent: %s" + info.messageId,
        });
        logger.log({
            level: "info",
            message: "Preview URL: %s" + nodemailer.getTestMessageUrl(info),
        });

        res.status(200).json({
            previewUrl: nodemailer.getTestMessageUrl(info),
        });
    } catch (error) {
        logger.log({
            level: "error",
            message: error,
        });
        res.status(400).json({ mailSent: "false" });
    }
};

module.exports = sendMail;
