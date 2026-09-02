const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  logout,
  forgotPassword,
  verifyCode,
  resetPassword,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyCode);
router.post("/reset-password", resetPassword);
router.get("/me", protect, getMe);

module.exports = router;
