const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;
const bcrypt = require("bcrypt");

var UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  isVerified: { type: Boolean, default: false },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  type: { type: String, required: true }
});

UserSchema.pre("save", function(next) {
  var user = this;
  if (!user.isModified("password")) return next();

  try {
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } catch (error) {
    throw error;
  }
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("user", UserSchema, "users");
