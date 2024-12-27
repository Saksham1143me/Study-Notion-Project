const express = require("express")
const router = express.Router()
const {
  login,
  signup,
  sendOtp,
  changePassword,
} = require("../controllers/auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetpass")

const { auth } = require("../middlewares/auth")
router.post("/login", login)
router.post("/signup", signup)
router.post("/sendotp", sendOtp)
router.post("/changepassword", auth, changePassword)
router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)
module.exports = router
