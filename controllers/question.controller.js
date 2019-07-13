const Question = require("../models/question.model");

exports.addQuestion = function(req, res) {
  var question = new Question({
    question: req.body.question,
    answer: req.body.answer,
    type: req.body.type,
    options: req.body.options
  });

  question.save().then(result=>{
    return res
    .status(200)
    .json({ success: true, message: "Question added successfully" });
  }).catch(error=>{
    return res
    .status(500)
    .json({ success: false, message: error.message });
  })
};
