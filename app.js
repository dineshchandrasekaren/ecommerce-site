const express = require("express");
require("dotenv").config();
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;
