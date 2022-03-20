const planModel = require("../Models/planModel");


module.exports.getAllPlans = async function getAllPlans(req, res) {
  try {
    let plans = await planModel.find();
    if (plans) {
      res.json({
        message: "plans retrieved",
        data: plans,
      });
    } else {
      res.json({
        message: "plans not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.getPlan = async function getPlan(req, res) {
  try {
    let id = req.params.id;
    let plan = await planModel.findById(id);
    if (plan) {
      res.json({
        message: "plan retrieved",
        data: plan,
      });
    } else {
      res.json({
        message: "plan not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.createPlan = async function createPlan(req, res) {
  try {
    let planData = req.body;
    let createPlan = await planModel.create(planData);
    res.json({
      message: "plan created successfully",
      data: createPlan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports.updatePlan= async function updatePlan(req, res) {
  try {
      let id = req.params.id;
      let datatoBeUpdated= req.body;
      let updatedPlan = await planModel.findByIdAndUpdate(id,datatoBeUpdated);
      res.json({
        message: "plan updated successfully",
        data: updatedPlan,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
}

module.exports.deletePlan = async function deletePlan(req, res) {
  try {
    let id = req.params.id;
    let deletedPlan = await planModel.findByIdAndDelete(id);
    res.json({
      message: "plan deleted successfully",
      data: deletedPlan,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


//top 3 plans

// module.exports.top3Plans= function top3Plans(req,res){
//     try{//this will find and sort the plans based on ratingsAverage paramter and than give first
//         //3 plans doc //sort is inbuilt method of a model
//      const top3Plans= await planModel.find().sort({
//          ratingsAverage:-1
//      }).limit(3);
//      res.json({
//          message:"top 3 plans",
//          data:top3Plans
//      })
//     }
//     catch(err){
//         res.status(500).json({
//             message:err.message
//         })
//     }
// }