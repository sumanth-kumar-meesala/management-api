const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var CompletedSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String },
  userId: { type: String },
  questionId:{type:String}
});

module.exports = mongoose.model("completed", CompletedSchema, "completeds");
