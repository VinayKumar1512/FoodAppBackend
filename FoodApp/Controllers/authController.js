const userModel = require("../Models/db");
const jwt = require("jsonwebtoken");
const jwt_key = require("./secret");

module.exports.signUp = async function signUp(req, res) {
  try {
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    //if user got added to db-> send res user signed up
    if (user) {
      res.json({
        message: "user signed up",
        data: dataObj,
      });
    } else {
      res.json({
        message: "error while signing in",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.login = async function login(req, res) {
  try {
    let data = req.body;
    let user = await userModel.findOne({ email: data.email });
    //if user exists in db
    if (user) {
      if (user.password == data.password) {
        // res.cookie('isLoggedIn',true,{httpOnly:true});
        //in cookie form we will send jwt or token
        let uid = user["id"];
        //secret key or jwt key must be string or bufferer key object
        let token = jwt.sign({ payload: uid }, jwt_key);
        res.cookie("isLoggedIn", token, { httpOnly: true });
        res.json({
          message: "user has logged In",
          userDetails: user,
        });
      } else {
        res.json({
          message: "invalid cred",
          userDetails: data,
        });
      }
    } else {
      res.json({
        message: "error",
        userDetails: data,
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.isAuthorised = function isAuthorised(roles) {
  return function (req, res, next) {
    //if role is admin,than only get all users

    console.log(req.role);
    if (roles.includes(req.role) == true) {
      next();
    } else {
      res.status(401).json({
        message: "login Again",
      });
    }
  };
};

module.exports.protectRoute = async function protectRoute(req, res, next) {
  try {
    //if cookie is sent in req is isLoggedIn means user in logged in so show data
    if (req.cookies.isLoggedIn) {
      //verify(jwt,jwt_key) -verfies new and prev sended signature
      //it gives backs us payload,here payload is our doc id
      let payload = jwt.verify(req.cookies.isLoggedIn, jwt_key);
      if (payload) {
        //if we go paylod means user is authenticated
        const user = await userModel.findById(payload.payload);
        console.log(user.role);
        console.log(user.id);
        req.role = user.role;
        req.id = user.id;
        next();
      }
    } else {
      //we are sending this to postman,but how our user will know that some error occured
      //we need to send something
      //we can check user agents by going to network -> headers in chrome browser tools
      const client= req.get("User-Agent");//it gives all the Users possible from where req can be send
      if(client.includes("Mozilla")==true){//if req is from browser
      res.redirect('/login');
      }
      else{//if req is from postman
      res.json({
        message: "login again",
      });
    }
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

/*Forgetpassword Feature Flow ->> 
-> User click on forgetPassowrd btn and enter email
-> we recieve that email and find that user in db if exists 
-> create a resetToken(to generate unique link) for resetting passoword and update its value in db
because using this resetToken we update value in db
-> send that link to mail
-> user click on link and redirected to resetpassword route
-> user enter new password and confirm passowrd,than using pass,confirmpass,
//and resettoken  we update doc to whom resetToken belong or user's password in db
-> */

module.exports.forgetPassword = async function forgetPassword(req, res) {
  let { email } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (user) {
      //this token is diff from login token,we just taken it for resetting password
      //createResetToken will create a token
      const resetToken = user.createResetToken(); //we can add method to mongoose documents,this method
      //is defined in db file, this method act upon each document
      //link we get for resetting looks like- http://abc.com/resetpassword/resetToken we have to build
      //this link
      let resetPasswordLink = `${req.protocol}://${req.get(
        "host"
      )}dc/resetPassword/${resetToken}`;
      //send mail using nodemailer
    } else {
      res.json({
        message: "please signup",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

module.exports.resetPassword = async function resetPassword(req, res) {
  try {
    const token = req.params.token;
    let { password, confirmPassoword } = req.body;
    const user = await userModel.findOne({ resetToken: token });
    if (user) {
      //resetPassword Handler will update user password in db
      user.resetPasswordHandler(password, confirmPassoword);
      await user.save();
      res.json({
        message: "password changed successfully",
      });
    } else {
      res.json({
        message: "problem while resetting",
      });
    }
  } catch (err) {
    res.json({
      message: err.message,
    });
  }
};

//in order to logout we need to remove cookie jwt which is stored at browser anyway
//what we do is that we send same cookie again with no value and expiry time as 1ms
module.exports.logout= async function logout(req, res) {
  res.cookie("isLoggedIn", " ", { maxAge: 1 });
  res.json({
    message: "user logged out successfully",
  });
}
