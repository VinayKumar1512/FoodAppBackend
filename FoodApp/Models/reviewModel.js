const mongoose = require("mongoose");
const userModel= require("./db")
const planModel= require("./planModel")

const db_link =
  "mongodb+srv://admin:n5nSfiW6Kr3Go7oA@cluster0.4dvnn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(db_link)
  .then(function (db) {
    //we have db which have database
    console.log("review db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

  //review shcema will have- review,rating,created At date, review is specific to user(kisne diya)
  // and plan(konse plan ke liye diya)
const reviewSchema= mongoose.Schema({
    review:{
        type:String,
        required:[true,'review is required']
    },
    rating:{
        type:Number,
        min:1,
        max:10,
        required:[true,'rating is required']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
   user:{
       //review koi user dega so we can have it's reference
       //this have value of type schema document or object id
       type:mongoose.Schema.ObjectId,
       ref:'userModel',
       required:[true,'review must belong to a user']
   },
   plan:{
       type:mongoose.Schema.ObjectId,
       ref:'planModel',
       required:[true,'reveiw must belong to a plan']
   }
})

//when a review is created it has-> review,rating,createdAt, user: its name and profile photo and
//plan:{ information or details related to plan}

//it states that whenever we perform any operation like find,findById,findOne
//populate or add into our review the user with-> name and profileImage and plan with
//whole data of the plan
//below it's denote as regex expressoin
reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:"user",
        select:"name profileImage"
    }).populate("plan");
    //peform next operations
    next();
})

const reviewModel = mongoose.model("reviewModel", reviewSchema);
module.exports = reviewModel;
