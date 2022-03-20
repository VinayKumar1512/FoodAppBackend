const userModel = require("../Models/db");
const planModel = require("../Models/planModel");

// test secret API key.
const stripe = require("stripe")(
  "sk_test_51KU74jSC8JL0wQzHF2fdbkZCFl1tmmd5nzeaiqWmlW5zdw2Q4DkOTfmv3ZaBTsFKKED37zhwVJw3nOSBbFEOpKs500u3rn3uUM"
);

module.exports.getGateway= function getGateway(req,res){  
    res.sendFile('booking.html',{root:__dirname});
}
module.exports.createSession = async function createSession(req, res) {
  try {
    let userId = req.id;//payment gateway is for user and is specific to plan so userId and planId
    let planId = req.params.id;

    //getting user and plan which user is buying
    const user = await userModel.findById(userId);
    const plan = await planModel.findById(planId);

    //creating session which includes our buying details 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      client_reference_id: plan._id,
      line_items: [
        {//product details
          name: plan.name,
          amount: plan.price * 100,
          currency: "inr",
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get("host")}/profile`,//url when payment is successful 
      cancel_url: `${req.protocol}://${req.get("host")}/profile`,//url when payment has failed
    });
//on the basis of success and failed we can redirect user to successs url or cancel url which
//will be returned in session
// res.redirect(303, session.url);
    res.json({
      status: "success",
      session,
    });
  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
};
