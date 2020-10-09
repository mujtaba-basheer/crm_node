const ObjectId = require("mongodb").ObjectID;
const sendMail = require("./../helper/mail");
const scheduleJob = require("./../helper/scheduler");

const getTableData = (req, res, db) => {
    db.collection("table")
        .find()
        .toArray()
        .then((data) => {
            console.log(data);
            if (data.length > 0) {
                res.status(200).json(data);
            } else {
                res.status(200).json({
                    dataExists: "false",
                });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                dbError: "db error",
            });
        });
};

const getData = (req, res, db) => {
    const { _id } = req.params;

    db.collection("table")
        .findOne({ _id: ObjectId(_id) })
        .then((data) => {
            console.log(data);
            res.status(200).json(data);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                dataExists: "false",
            });
        });
};

const postTableData = (req, res, db) => {
    console.log("log");
    const {
        cust_name,
        cust_email,
        cust_phn,
        cust_address,
        cust_gst,
        rem_freq,
    } = req.body;

    const timestamp = new Date().toISOString();
    const cust_comm = [];

    db.collection("table")
        .insertOne({
            cust_name,
            cust_email,
            cust_phn,
            cust_address,
            cust_gst,
            rem_freq,
            timestamp,
            cust_comm,
        })
        .then((data) => {
            const { _id } = data.ops[0];
            db.collection("table")
                .updateOne(
                    { _id: ObjectId(_id) },
                    {
                        $set: { cust_id: _id },
                    }
                )
                .then((item) => {
                    res.status(200).json(data.ops[0]);
                })
                .catch((err) => {
                    console.error(err);
                    res.status(400).json({ dbError: "db error" });
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ dbError: "db error" });
        });
};

const addComm = (req, res, db) => {
    const { timestamp, details, cust_id } = req.body;

    db.collection("table")
        .updateOne(
            { _id: ObjectId(cust_id) },
            {
                $push: {
                    cust_comm: {
                        $each: [{ timestamp, details }],
                        $position: 0,
                    },
                },
            }
        )
        .then((data) => {
            res.status(200).json({ dbUpdate: "true" });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ dbError: "db error" });
        });
};

const putTableData = (req, res, db) => {
    const {
        cust_id,
        cust_name,
        cust_email,
        cust_phn,
        cust_address,
        cust_gst,
        rem_freq,
    } = req.body;

    db.collection("table")
        .updateOne(
            { _id: ObjectId(cust_id) },
            {
                $set: {
                    cust_name,
                    cust_email,
                    cust_phn,
                    cust_address,
                    cust_gst,
                    rem_freq,
                },
            }
        )
        .then((item) => {
            console.log(item);
            db.collection("table")
                .findOne({
                    _id: ObjectId(cust_id),
                })
                .then((data) => {
                    console.log(data);
                    res.status(200).json(data);
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).json({
                        dataExists: "false",
                    });
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(400).json({ dbError: "db error" });
        });
};

const deleteTableData = (req, res, db) => {
    const { cust_id } = req.body;

    db.collection("table")
        .deleteOne({ _id: ObjectId(cust_id) })
        .then((data) => {
            console.log(data);
            res.status(200).json({ delete: "true" });
        })
        .catch((err) => res.status(400).json({ dbError: "db error" }));
};

const mailer = (req, res, db) => {
    const { cust_email, subject, body } = req.body;
    sendMail(
        {
            email: cust_email,
            subject,
            body,
        },
        res
    );
};

const scheduleMail = (req, res, db) => {
    const { cust_email, subject, body, delay } = req.body;
    scheduleJob({ email: cust_email, subject, body }, delay, res);
};

module.exports = {
    getTableData,
    postTableData,
    putTableData,
    deleteTableData,
    getData,
    addComm,
    mailer,
    scheduleMail,
};
