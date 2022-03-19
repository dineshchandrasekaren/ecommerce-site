const express = require("express");
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  userDashboard,
  changePassword,
  updateUserDashboard,
  manager,
  adminAllUser,
  updateSpecificUser,
  deleteSpecificUser,
} = require("../controllers/userController");
const { customRole } = require("../middlewares/CustomRole");
const { isLogin } = require("../middlewares/isLogin");
const router = express.Router();
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(isLogin, userDashboard);
router.route("/password/update").post(isLogin, changePassword);
router.route("/userdashboard/update").post(isLogin, updateUserDashboard);
router.route("/manager").get(isLogin, customRole("manager"), manager);
router.route("/admin").get(isLogin, customRole("admin"), adminAllUser);
router
  .route("/admin/user/:id")
  .put(isLogin, customRole("admin"), updateSpecificUser)
  .delete(isLogin, customRole("admin"), deleteSpecificUser);
module.exports = router;
