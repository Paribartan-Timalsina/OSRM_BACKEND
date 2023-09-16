const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  forgotPasswprd,
} = require("../controllers/userController");
const router = express.Router();

//create user route
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPasswprd);
module.exports = router;
