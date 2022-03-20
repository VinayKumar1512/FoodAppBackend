const mongoose = require("mongoose");

const db_link =
  "mongodb+srv://admin:n5nSfiW6Kr3Go7oA@cluster0.4dvnn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(db_link)
  .then(function (db) {
    //we have db which have database
    console.log("plan db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

//all validations is for admin,restaurnat owner who are creating plans
const planSchema= mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxLength:[20,'plan name should not exceed 20 chars']//allows us to give custom message
        //on not fulfilling validation (array format)
    },
    duration:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:[true,'price not entered']
    },
    ratingsAverage:{
        type:Number
    },
    discount:{
        type:Number,
        validate:[function(){
            return this.discount<100;//discount can't be more than price of plan
        },'discount not exceed price']
    }
})

const planModel = mongoose.model("planModel", planSchema);
module.exports = planModel;
