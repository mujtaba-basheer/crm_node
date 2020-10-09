const express = require("express");
const routes = require("./routes");

const { createLogger, format, transports } = require("winston");
const { combine, prettyPrint, timestamp } = format;

// use process.env variables to keep private variables,
// be sure to ignore the .env file in github
require("dotenv").config();

// Express Middleware
const helmet = require("helmet"); // creates headers that protect from attacks (security)
const bodyParser = require("body-parser"); // turns response into usable format
const cors = require("cors"); // allows/disallows cross-site communication
const morgan = require("morgan"); // logs requests for HTTP requests

// connfiguring winston logger
const logger = createLogger({
    format: combine(timestamp(), prettyPrint()),
    transports: [new transports.Console()],
});

// App
const app = express();

// App Middleware
const whitelist = ["http://localhost:3000"];
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
app.use(morgan("combined"));

// App Routing is being handled by Express Router

app.use("/", routes);

// App Server Connection
app.listen(process.env.PORT || 3000, () => {
    logger.info(`app is running on port ${process.env.PORT || 3000}`);
});
