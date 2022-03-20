const express = require("express");
const userRouter = express.Router();
const {
  getAllUser,
  updateUser,
  deleteUser,
  getUser,
} = require("../Controllers/userController");
const {
  signUp,
  login,
  isAuthorised,
  protectRoute,
  forgetPassword,
  resetPassword,
  logout
} = require("../Controllers/authController");

//user ke options
userRouter.route("/:id").patch(updateUser).delete(deleteUser);

userRouter.route("/signup").post(signUp);

userRouter.route("/login").post(login);

userRouter.route("/forgetpassword").post(forgetPassword);

userRouter.route("/resetpassword/:token").post(resetPassword);

userRouter.route('/logout')
.get(logout);

//profile page
userRouter.use(protectRoute);
userRouter.route("/userProfile").get(getUser);

//admin specific func
//isAuthorised middleware to check is user authorised
userRouter.use(isAuthorised(["admin"]));
userRouter.route("/").get(getAllUser);

module.exports = userRouter;
