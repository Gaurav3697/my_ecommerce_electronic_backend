const app = require("./app.js"); 
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");

//config
if(process.env.NODE_ENV!=="PRODUCTION"){   //if the project will be in production mode it will not use the source
    require("dotenv").config({path:"backend/config/config.env"}) //imported dotenv and gave path of config.env
}

// Connecting to database
connectDatabase();

//cloudinary integration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
//   });


//Code for unhandles promise rejection occurs
process.on("unhandledRejection",(err)=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting Down the server due to unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1);
    })
})
//code to handle uncaught Exeption
process.on("uncaughtException",(err)=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting Down the server due to uncaught exception");
    process.exit(1);
})

//listening the server function
const server = app.listen(process.env.PORT,()=>{
    console.log(`Your Server is listening on port http://localhost:${process.env.PORT}`);
})