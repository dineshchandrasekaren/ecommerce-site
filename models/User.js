const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { mongoose } = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [40, "Name should be under 40 character"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    validate: [
      validator.isEmail,
      "Please enter email address in correct format",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide an password"],
    minlength: [6, "password should be atleast 6 character"],
    select: false,
  },
  photo: {
    id: {
      type: String,
      required: true,
    },
    secure_url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  forgotPasswordToken: String,
  forgotPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});
UserSchema.methods.validatePassword = async function (usersendPassword) {
  return await bcryptjs.compare(usersendPassword, this.password);
};

UserSchema.methods.getToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.PRIVATE_KEY, {
    expiresIn: "3d",
  });
};
UserSchema.methods.forgotPassword = async function () {
  const forgotToken = crypto.randomBytes(20).toString("hex");
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");
  this.forgotPasswordExpire = new Date(Date.now() + 20 * 60 * 1000);
  return forgotToken;
};
module.exports = mongoose.model("User", UserSchema);
