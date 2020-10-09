const nodemailer = require("nodemailer");

const { createLogger, format, transports } = require("winston");
const { combine, prettyPrint, timestamp } = format;
const logger = createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [new transports.Console()],
});

const sendMail = async ({ email, subject, body }, res) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: "desirecoupons2020@gmail.com", // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            text: body, // plain text body
        });

        res.status(200).json({
            mailSent: "true",
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
