const { BigPromise } = require("../middlewares/BigPromise");
const { user } = require("../models/User");
exports.signup = BigPromise(async (req, res, next) => {
  const { name, email, password } = req.body;
});
