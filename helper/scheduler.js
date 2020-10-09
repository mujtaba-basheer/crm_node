const sendMail = require("./mail");
const kue = require("kue-scheduler");
const { createLogger, format, transports } = require("winston");
const { combine, prettyPrint, timestamp } = format;
const logger = createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [new transports.Console()],
});
const Queue = kue.createQueue({
    skipConfig: false,
    redis: {
        port: 6379,
        host: "127.0.0.1",
        db: 2,
    },
    restore: true,
});

Queue.removeAllListeners();

const scheduleJob = (mail_details, delay, res) => {
    //processing jobs
    Queue.process("schedule", function (job, done) {
        console.log("\nProcessing job with id %s at %s", job.id, new Date());
        done(null, {
            deliveredAt: new Date(),
        });
    });

    //listen on scheduler errors
    Queue.on("schedule error", function (error) {
        //handle all scheduling errors here
        logger.error(err);
    });

    //listen on success scheduling
    Queue.on("schedule success", function (job) {
        //a highly recommended place to attach
        //job instance level events listeners

        job.on("complete", function (result) {
            logger.info("Job completed with data " + JSON.stringify(result));
            Queue.removeAllListeners();
            sendMail(mail_details, res);
            Queue.clear();
            job.remove();
        })
            .on("failed attempt", function (errorMessage, doneAttempts) {
                logger.log({
                    level: "error",
                    message: "Job failed",
                });
            })
            .on("failed", function (errorMessage) {
                console.log("Job failed");
                res.status(400).json({ mailSent: "false" });
            })
            .on("progress", function (progress, data) {
                console.log(
                    "\r  job #" +
                        job.id +
                        " " +
                        progress +
                        "% complete with data ",
                    data
                );
            });
    });

    //prepare a job to perform
    //dont save it
    var job = Queue.createJob("schedule", {
        to: "any",
    })
        .attempts(3)
        .backoff({
            delay: 6000,
            type: "fixed",
        })
        .priority("normal");

    //schedule a job then
    Queue.schedule(`${delay} seconds from now`, job);
};

module.exports = scheduleJob;
