const MongoClient = require("mongodb").MongoClient;
const env = require("dotenv");
const router = require("express").Router();
const main = require("./controllers/main");

env.config();

const dbName = "test";
const client = new MongoClient(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

client.connect(function (err, db) {
    if (!err) {
        console.log("Connected to Database!");
        const db_instance = db.db(dbName);

        router.route("/").get((req, res) => res.send("CRM API"));

        router
            .route("/crud")
            .get((req, res) => main.getTableData(req, res, db_instance))
            .put((req, res) => main.putTableData(req, res, db_instance))
            .post((req, res) => main.postTableData(req, res, db_instance))
            .delete((req, res) => main.deleteTableData(req, res, db_instance));

        // db.close();
    } else {
        console.error(err);
    }
});

module.exports = router;
