require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
// const home = require("./Routes/home");
const user = require("./Routes/user");
const cookieParser = require("cookie-parser");

// morgan middleware
app.use(morgan("tiny"));

//cookie middleware
app.use(cookieParser());

// fileupload middleware
const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers middlewares
const prefix = "/api/v1"; //? url prefix
// app.use(prefix, home);
app.use(prefix, user);

module.exports = app;
