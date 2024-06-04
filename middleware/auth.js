//import catchAsyncErrors
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const isAuthenticated = catchAsyncError(async(req,res,next)=>{
    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please Login to acess this source",401));
    }
    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    //Find user from decodedData
    req.user = await User.findById(decodedData.id);
    next()
})

//chech if the user is allowed to acss the source or not
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(
            `Role: ${req.user.role} is not allowed to access this resouce `,
            403
          )
        );
      }
      next();
    }}

module.exports = {isAuthenticated,authorizeRoles} ;
  