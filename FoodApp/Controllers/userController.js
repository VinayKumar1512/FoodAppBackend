/*file contain functionality of users Router
exporting methods*/
const userModel = require("../Models/db");

module.exports.getAllUser = async function getAllUser(req, res) {
  let allUsers = await userModel.find();
  if (allUsers) {
    res.json({
      message: "list of all users",
      data: allUsers,
    });
  } else {
    res.json({
      message: "invalid info",
    });
  }
};

module.exports.updateUser = async function updateUser(req, res) {
  //error dekh lena ek baar
  //update data of user with id as req.params.id
  try {
    let id = req.params.id;
    console.log(id);
    let datatoBeUpdated = req.body;
    let user = await userModel.findByIdAndUpdate(id, datatoBeUpdated);
    res.json({
      message: "data updated successfully",
      data: user,
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.deleteUser = async function deleteUser(req, res) {
  //delete user with id as req.params.id
  try {
    let id = req.params.id;
    let user = await userModel.findByIdAndDelete(id);
    res.json({
      message: "data has been deleted",
      data: user,
    });
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.getUser = async function getUser(req, res) {
  try {
    let id = req.id;
    let user = await userModel.findById(id);
    if (user) {
      res.json({
        message: "User Found",
        data: user,
      });
    } else {
      res.json({
        message: "user not found",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};
