const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
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
  email: {
    type: String,
    required: [true, "Please provide an password"],
    minlength: [6, "password should be atleast 6 character"],
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
  if (!UserSchema.isModified("password")) {
    return next();
  }
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});
UserSchema.method.validatePassword = async (usersendPassword) =>
  await bcryptjs.compare(usersendPassword, this.password);

UserSchema.method.getToken = async () =>
  await jsonwebtoken.sign({ id: this._id }, process.env.PRIVATE_KEY, {
    expiresIn: "3d",
  });

UserSchema.method.forgotPassword = async () => {
  const forgotToken = crypto.randomBytes(20).toString("hex");
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");
};
module.exports = mongoose.model("/users", UserSchema);
