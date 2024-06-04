class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message); // used to access properties on an object literal or class's [[Prototype]], or invoke a superclass's constructor
        this.statusCode = statusCode; //refers to the context where a piece of code, such as a function's body, is supposed to run.
        Error.captureStackTrace(this,this.constructor);//capture call frame locations, which in turn allows us to pinpoint error locations. typically contain a hierarchy of code calls but often include many unrelated function calls. 
    }
}

module.exports = ErrorHandler;