//review Routes
const express = require("express");
const reviewRouter = express.Router();
const { protectRoute } = require("../Controllers/authController");
const {
  getAllReviews,
  top3Reviews,
  getPlanReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../Controllers/reviewController");

reviewRouter.route("/all").get(getAllReviews);

//top3 reviews
reviewRouter.route("/top3").get(top3Reviews);

reviewRouter.route("/:id").get(getPlanReviews);

reviewRouter.use(protectRoute);
reviewRouter.route("/crud/:plan")
.post(createReview)
.patch(updateReview)
.delete(deleteReview);

module.exports = reviewRouter;
