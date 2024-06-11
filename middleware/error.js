const ErrorHandler = require("../utils/errorHandler")

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal server Error";
    
    //Wrong MongoDB ID error
    if(error.name === "CastError"){
        const message = `Resource not found. Invalid:${error.path}`;
        error = new ErrorHandler(message,400);
    }

    //Mongoose Duplicate Key Error
    if(error.code === 11000){
        const message = `Duplicate object Key ${error.keyValue} Entered`
        error = new ErrorHandler(message,400);
    }

    //Wrong JWT error
    if (error.name === "JsonWebTokenError"){
        const message = `Json web Token is invalid,Try again`;
        error = new ErrorHandler(message,400);
    }

    //send error status and message
    res.status(error.statusCode).json({
        success:false,
        error:error,
        message:error.message
    })
}