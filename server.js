const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const routes = require("./routes");

// use process.env variables to keep private variables,
// be sure to ignore the .env file in github
require("dotenv").config();

// Express Middleware
const helmet = require("helmet"); // creates headers that protect from attacks (security)
const bodyParser = require("body-parser"); // turns response into usable format
const cors = require("cors"); // allows/disallows cross-site communication
const morgan = require("morgan"); // logs requests

// db Connection w/ Heroku
// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//   }
// });

// db Connection w/ localhost
var db = require("knex")({
    client: "pg",
    connection: {
        host: "localhost",
        user: "swetabhmukherjee",
        password: "password",
        database: "crm",
        port: 5432,
    },
});

// Controllers - aka, the db queries
const main = require("./controllers/main");

// App
const app = express();

// App Middleware
const whitelist = ["http://localhost:3001"];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan("combined")); // use 'tiny' or 'combined'

// App Routing is being handled by Express Router

app.use("/", routes);

// App Server Connection
app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT || 3000}`);
});
