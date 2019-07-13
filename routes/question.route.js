const express = require("express");
const question_controller = require("../controllers/question.controller");
const verify_token = require("./verify.token");
const router = express.Router();

router.post('/addQuestion',verify_token, question_controller.addQuestion);

module.exports = router;