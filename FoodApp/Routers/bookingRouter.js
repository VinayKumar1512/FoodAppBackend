const express = require("express");

const bookingRouter = express.Router();
const { protectRoute } = require("../Controllers/authController");
const {
  createSession,
  getGateway,
} = require("../Controllers/bookingController");

bookingRouter
  .route("/createSession")
  .get(getGateway)
  .post(protectRoute, createSession);

module.exports = bookingRouter;
