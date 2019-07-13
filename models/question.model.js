const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String },
  type: { type: String, required: true },
  options: { type: Array }
});

module.exports = mongoose.model("question", QuestionSchema, "questions");
