const BigPromise = require("../middlewares/BigPromise");
const userModel = require("../models/User");
const CookieToken = require("../utils/CookieToken");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");
const { sendMail } = require("../utils/nodemailerConfig");
exports.signup = BigPromise(async (req, res, next) => {
  let sampleFile = req.files.photo;

  if (!sampleFile) {
    return next(new Error("please upload photo"));
  }

  const result = await cloudinary.uploader.upload(sampleFile.tempFilePath, {
    folder: "users",
    width: 150,
    crop: "scale",
  });

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

exports.logout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).send({
    success: true,
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new Error("please enter registered email"));
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return next(new Error("no user found. please first"));
  }
  const token = await user.forgotPassword();
  user.save({ validateBeforeSave: false });
  const url = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${token}`;
  try {
    await sendMail({
      to: email,
      subject: "T store reset password",
      text: "please click the below link",
      url,
    });
    res.status(200).send({ success: true });
  } catch (error) {
    resetForgotToken(user);
    user.save({ validateBeforeSave: false });
    return next(new Error(error));
  }
});

async function resetForgotToken(user) {
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpire = undefined;
}
exports.resetPassword = BigPromise(async (req, res, next) => {
  const { token } = req.params;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userModel
    .findOne({
      forgotPasswordToken: hashToken,
      forgotPasswordExpire: { $gt: Date.now() },
    })
    .select("+password");
  if (!user) {
    return next(new Error("please check our email. Email not found."));
  }
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new Error("password doesn't match"));
  }
  user.password = password;
  resetForgotToken(user);
  await user.save();
  await CookieToken(res, user);
});
exports.userDashboard = BigPromise(async (req, res, next) => {
  if (!req.user) {
    return next(new Error("Please login"));
  }
  res.status(200).json(req.user);
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).select("+password");
  const { oldPassword, password } = req.body;

  if (!(await user.validatePassword(oldPassword)))
    return next(new Error("your password was wrong. Try again"));

  user.password = password;
  await user.save();
  await CookieToken(res, user);
});

exports.updateUserDashboard = BigPromise(async (req, res, next) => {
  const updatedUser = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.files) {
    const user = await userModel.findById(req.user._id);
    cloudinary.uploader.destroy(req.user.photo.id);
    const { public_id, secure_url } = cloudinary.uploader.upload(
      req.files.photo.tempFilePath,
      {
        folder: "users",
        width: 150,
        crop: "scale",
      }
    );
    user.photo.id = public_id;
    user.photo.secure_url = secure_url;

    await user.save({ validateBeforeSave: false });
  }
  const user = await userModel.findByIdAndUpdate(req.user._id, updatedUser);

  res.status(200).json({ success: true, user });
});

exports.manager = BigPromise(async (req, res, next) => {
  const users = await userModel.find({ role: "user" });

  res.status(200).send(users);
});
exports.adminAllUser = BigPromise(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).send(users);
});

exports.getSpecificUser = BigPromise(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new Error("user not found"));
  }
  res.status(200).send(user);
});
exports.updateSpecificUser = BigPromise(async (req, res, next) => {
  const updatedUser = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await userModel.findByIdAndUpdate(req.params.id, updatedUser);

  if (!user) {
    return next(new Error("user not found"));
  }
  res.status(200).send({ success: true, user });
});
exports.deleteSpecificUser = BigPromise(async (req, res, next) => {
  const user = await userModel.findOneAndDelete({ _id: req.params.id });
  if (!user) {
    return next(new Error("user not found"));
  }
  res.status(200).send(user);
});
