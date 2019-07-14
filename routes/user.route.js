const express = require("express");
const user_controller = require("../controllers/user.controller");
const verify_token = require("./verify.token");

const router = express.Router();

router.get('/confirmation/:token', user_controller.confirmation);
router.post('/resend', user_controller.resendToken);
router.post("/register", user_controller.register);
router.post("/login", user_controller.login);
router.post("/updatePassword", user_controller.updatePassword);

module.exports = router;