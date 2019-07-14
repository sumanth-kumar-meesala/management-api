const User = require("../models/user.model");
const Token = require("../models/token.model");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

exports.register = function(req, res) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user)
        return res.status(400).json({
          success: false,
          message:
            "The email address you have entered is already associated with another account."
        });

      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        type: req.body.type
      });

      user
        .save()
        .then(result => {
          return sendVerificationMail(result, req, res);
        })
        .catch(error => {
          return res
            .status(500)
            .json({ success: false, message: error.message });
        });
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};

exports.login = function(req, res) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          success: true,
          message:
            "The email address " +
            req.body.email +
            " is not associated with any account. Double-check your email address and try again."
        });
      }

      user.comparePassword(req.body.password, function(error, isMatch) {
        if (error) {
          return res
            .status(500)
            .json({ success: false, message: error.message });
        }

        if (!isMatch) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid email or password" });
        }

        if (!user.isVerified) {
          return res.status(401).json({
            success: false,
            message: "Your account has not been verified."
          });
        }

        const payload = {
          userid: user._id
        };

        var token = jwt.sign(payload, "secret", {
          expiresIn: 60 * 60 * 60 * 60 * 240
        });

        res.json({
          success: true,
          message: "Access token generation successfull.",
          data: { token: token, type: user.type }
        });
      });
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};

exports.confirmation = function(req, res) {
  Token.findOne({ token: req.params.token }).then(token => {
    if (!token) {
      return res.status(400).json({
        success: false,
        message:
          "We were unable to find a valid token. Your token my have expired."
      });
    }

    User.findOne({ _id: token._userId })
      .then(user => {
        if (!user) {
          return res.status(400).json({
            success: false,
            message: "We were unable to find a user for this token."
          });
        }

        if (user.isVerified) {
          return res.status(400).json({
            success: false,
            message: "This user has already been verified."
          });
        }

        user.isVerified = true;

        user
          .save()
          .then(result => {
            res
              .status(200)
              .json("The account has been verified. Please log in.");
          })
          .catch(error => {
            return res
              .status(500)
              .json({ success: false, message: error.message });
          });
      })
      .catch(error => {
        return res.status(500).json({ success: false, message: error.message });
      });
  });
};

exports.resendToken = function(req, res) {
  User.findOne()
    .then(user => {
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "We were unable to find a user with that email."
        });
      }

      if (user.isVerified) {
        return res.status(400).json({
          success: false,
          message: "This account has already been verified. Please log in."
        });
      }

      return sendVerificationMail(user, req, res);
    })
    .then(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};

exports.updatePassword = function(req, res) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          success: true,
          message:
            "The email address " +
            req.body.email +
            " is not associated with any account. Double-check your email address and try again."
        });
      }

      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }

        bcrypt.hash(req.body.password, salt, function(err, hash) {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: err.message });
          }

          User.findByIdAndUpdate(user.id, { password: hash })
            .then(result => {
              res.json({
                success: true,
                message: "Password updated successfully"
              });
            })
            .catch(error => {
              return res
                .status(500)
                .json({ success: false, message: error.message });
            });
        });
      });
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};

exports.addUser = function(req, res) {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user)
        return res.status(400).json({
          success: false,
          message:
            "The email address you have entered is already associated with another account."
        });

      user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        type: req.body.type,
        isVerified: true
      });

      user
        .save()
        .then(result => {
          return res.status(200).json({
            success: true,
            message: "User created successfully"
          });
        })
        .catch(error => {
          return res
            .status(500)
            .json({ success: false, message: error.message });
        });
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};

exports.listUser = function(req, res) {
  User.find({})
    .then(data => {
      return res.status(200).json({
        success: true,
        message: "List fetched successfully.",
        data: data
      });
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};

sendVerificationMail = function(user, req, res) {
  var token = new Token({
    _userId: user._id,
    token: crypto.randomBytes(16).toString("hex")
  });

  token
    .save()
    .then(result => {
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.email,
          pass: process.env.password
        }
      });

      var link =
        "https://murmuring-woodland-60693.herokuapp.com/user/confirmation/" +
        token.token;

      var mailOptions = {
        from: "noreplay@sumanth.com",
        to: user.email,
        subject: "Management account verification",
        text: "Click to activite account " + link
      };

      transporter
        .sendMail(mailOptions)
        .then(result => {
          res.status(200).json({
            success: true,
            message: "A verification email has been sent to " + user.email + "."
          });
        })
        .catch(error => {
          return res
            .status(500)
            .json({ success: false, message: error.message });
        });
    })
    .catch(error => {
      return res.status(500).json({ success: false, message: error.message });
    });
};
