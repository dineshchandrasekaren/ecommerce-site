require("dotenv").config();
const app = require("./app");
const { connect } = require("./config/db");
connect();
app.listen(
  process.env.PORT,
  console.log(`server is running at port: ${process.env.PORT}`)
);
