//plans Routes
const express = require("express");
const planRouter = express.Router();
const { protectRoute,isAuthorised } = require("../Controllers/authController");
const {getAllPlans,getPlan,createPlan,updatePlan,deletePlan}=require("../Controllers/planController");

//get specific plan - user own plan-> //for this user must be logged in
    planRouter.use(protectRoute);
    planRouter
    .route("/plan/:id")
    .get(getPlan);

    planRouter
    .route("/allPlans")
    .get(getAllPlans);

    //admin- restaurant owner specific
    planRouter.use(isAuthorised(['admin','restaurantowner']));
    planRouter
    .route("/crudPlan")
    .post(createPlan)

    planRouter.route("/crudPlan/:id")
    .patch(updatePlan)
    .delete(deletePlan);

//top 3 Plans
module.exports = planRouter;
