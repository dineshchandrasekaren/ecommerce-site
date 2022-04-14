const express = require("express");
const {
  addProduct,
  getAllProduct,
} = require("../controllers/productController");
const { customRole } = require("../middlewares/CustomRole");
const { isLogin } = require("../middlewares/isLogin");

const router = express.Router();

router.route("/admin/product").post(isLogin, customRole("admin"), addProduct);
router.route("/getproduct").get(getAllProduct);

module.exports = router;
