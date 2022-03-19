const BigPromise = require("./BigPromise");
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");

exports.isLogin = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return next(new Error("please login or register "));
  }

  const decode = await jwt.verify(token, process.env.PRIVATE_KEY);
  if (!decode) {
    return next(new Error("token expired"));
  }
  const user = await userModel.findById({ _id: decode.id });
  if (!user) {
    return next(new Error("invalid token"));
  }
  req.user = user;
  console.log(req.user);
  next();
});
