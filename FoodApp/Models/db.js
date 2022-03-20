const mongoose = require("mongoose");
const emailValidator = require("email-validator");
const crypto = require("crypto");

const db_link =
  "mongodb+srv://admin:n5nSfiW6Kr3Go7oA@cluster0.4dvnn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(db_link)
  .then(function (db) {
    //we have db which have database
    console.log("db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

//represent info related to user
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: function () {
      return emailValidator.validate(this.email); //this points to current document
      //if email is not valid mongoose will throw error
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  confirmPassword: {
    type: String,
    required: true,
    minLength: 8,
    validate: function () {
      return this.password == this.confirmPassword;
    },
  },
  role: {
    type: String,
    enum: ["admin", "user", "restaurantowner", "deliveryboy"],
    default: "user",
  },
  profileImage: {
    type: String,
    default: "img/users/default.jpeg",
  },
  //it is basically a random token we generate to reset password for every unique user
  resetToken: String,
});

userSchema.methods.createResetToken = function () {
  //creating unique token using npm i crypto
  const resetToken = crypto.randomBytes(32).toString("hex");
  //setting curr doc resetToken paramter value
  this.resetToken = resetToken;
  return resetToken;
};

userSchema.methods.resetPasswordHandler = function (password, confirmPassword) {
  this.password = password;
  this.confirmPassword = confirmPassword;
};
const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
