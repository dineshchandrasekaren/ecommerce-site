const BigPromise = require("../middlewares/BigPromise");
const userModel = require("../models/User");
const CookieToken = require("../utils/CookieToken");
const cloudinary = require("../config/cloudinary");
exports.signup = BigPromise(async (req, res, next) => {
  let sampleFile = req.files.sampleFile;

  if (!sampleFile) {
    return next(new Error("please upload photo"));
  }

  const result = await cloudinary.uploader.upload(sampleFile.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });
  console.log(result);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new Error("name , email ,password are mandatary"));
  }

  const user = await userModel.create({
    name,
    email,
    password,
    photo: { id: result.public_id, secure_url: result.secure_url },
  });
  await CookieToken(res, user);
});

exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new Error("email and password was mandatory"));
  }

  const user = await userModel.findOne({ email });
  if (!(user && (await user.validatePassword(password)))) {
    return next(new Error("email or password was incorrect"));
  }

  await CookieToken(res, user);
});
