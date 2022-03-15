const express = require("express");
const morgan = require("morgan");
const app = express();
const home = require("./Routes/home");

// morgan middleware
app.use(morgan("tiny"));

// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers middlewares
const prefix = "/api/v1"; //? url prefix
app.use(prefix, home);

module.exports = app;
