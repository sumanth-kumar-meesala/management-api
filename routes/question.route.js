const express = require("express");
const question_controller = require("../controllers/question.controller");
const verify_token = require("./verify.token");
const router = express.Router();

router.post("/add", verify_token, question_controller.add);
router.post("/list", verify_token, question_controller.list);
router.post("/completed", verify_token, question_controller.completed);

module.exports = router;
