const Question = require("../models/question.model");
const Completed = require("../models/completed.model");

exports.add = function(req, res) {
  var question = new Question({
    question: req.body.question,
    answer: req.body.answer,
    type: req.body.type,
    options: req.body.options
  });

  question
    .save()
    .then(result => {
      return res
        .status(200)
        .json({ success: true, message: "Question added successfully" });
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};

exports.completed = function(req, res) {
  var completed = new Completed({
    question: req.body.question,
    answer: req.body.answer,
    userId: req.body.userId,
    questionId: req.body.questionId
  });

  completed
    .save()
    .then(result => {
      return res
        .status(200)
        .json({ success: true, message: "Answer submitted successfully" });
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};

exports.list = function(req, res) {
  Question.find({})
    .then(data => {
      return res.status(200).json({
        success: true,
        message: "Question added successfully",
        data: data
      });
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};

exports.listCompleted = function(req, res) {
  Completed.find({})
    .then(data => {
      return res.status(200).json({
        success: true,
        message: "Completed question list",
        data: data
      });
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};

exports.submit = function(req, res) {
  Question.find({})
    .then(data => {
      return res.status(200).json({
        success: true,
        message: "Question added successfully",
        data: data
      });
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};
