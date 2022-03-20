const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const userRouter = require("./Routers/userRouter");
app.use("/users", userRouter);
const planRouter= require("./Routers/planRouter");
app.use('/plans',planRouter);
const reviewRouter= require('./Routers/reviewRouter');
app.use('/reviews',reviewRouter);
const bookingRouter= require("./Routers/bookingRouter");
app.use('/booking',bookingRouter);
 
app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
