const planModel = require("../Models/planModel");
const reviewModel = require("../Models/reviewModel");

module.exports.getAllReviews = async function getAllReviews(req, res) {
  try {
    const reviews = await reviewModel.find();
    if (reviews) {
      res.json({
        message: "reviews retrived",
        data: reviews,
      });
    } else {
      res.json({
        message: "reviews not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.top3Reviews = async function top3Reviews(req, res) {
  try {
    const reviews = await reviewModel
      .find()
      .sort({//sort in desc order
        rating: -1,
      })
      .limit(3); //top 3 reviews based on rating

    if (reviews) {
      res.json({
        message: "reviews retrived",
        data: reviews,
      });
    } else {
      res.json({
        message: "reviews not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.getPlanReviews = async function getPlanReviews(req, res) {
  try {
    let planid = req.params.id; //we have to get reviews of a plan
    let reviews = await reviewModel.find(); //get all reviews
    reviews = reviews.filter((review) => review.plan._id == planid); //filter out reviews specific to a plan
    if (reviews) {
      res.json({
        message: "reviews retrived",
        data: reviews,
      });
    } else {
      res.json({
        message: "reviews not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

//when we create a review it is specific to a plan,so we got it's id
//average rating of the plan will also change it will become (averageRating + new Rating)/no. of
//reviews already given + 1
//for no. of reviews we need to keep an entry in plan schema and whenever we create review
//increase it by 1, we can accesss plan as we are getting it's id already
module.exports.createReview = async function createReview(req, res) {
  try {
    let id = req.params.plan;
    let plan = await planModel.findById(id);
    let review = await reviewModel.create(req.body);
    plan.ratingsAverage = (plan.ratingsAverage + req.body.rating) / 2;
    await plan.save();

    res.json({
      message: "review created",
      data: review,
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

//we got to a plan(got planid),we have it's all review,than we change plan data and make
//update req for that plan,we data of that plan in json form
module.exports.updateReview = async function updateReview(req, res) {
  try {
    let planid = req.params.plan;
    //review id from frontend,we got
    let id = req.body.id;
    let datatoBeUpdated = req.body;

    let review = await reviewModel.findByIdAndUpdate(id, datatoBeUpdated);

    res.json({
      message: "review updated succesfully",
      data: review,
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.deleteReview = async function deleteReview(req, res) {
  try {
    let planid = req.params.plan;
    //review id we got from frontend
    let id = req.body.id;
    let review = await reviewModel.findByIdAndDelete(id);

    res.json({
      message: "review deleted succesfully",
      data: review,
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};




