// imports  
const express = require("express");
const app = express();
const path = require("path");
const errorMiddleware = require("./middleware/error");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser") // what does this do
const fileUpload = require("express-fileupload");
const cors = require("cors");


//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({path:"config/config.env"})
}

//app.use section
app.use(fileUpload());
app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true})); 

//Route imports
const product = require("./routes/productRoutes");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoutes");
// const payment = require("./routes/paymentRoutes");

//using the routes
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
// app.use("/api/v1",payment);

//Middleware for errors
app.use(errorMiddleware);

module.exports = app; //exporting the app

//I will deal payment at last