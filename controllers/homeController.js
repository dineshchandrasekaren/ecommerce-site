const BigPromise = require("../middlewares/BigPromise");

exports.home = BigPromise((req, res) => {
  res.status(200).send("Home route was working");
});
