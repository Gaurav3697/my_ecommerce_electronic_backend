const app = require("./app.js"); 
const connectDatabase = require("./config/database");
const cloudinary = require('cloudinary');


//config
if(process.env.NODE_ENV!=="PRODUCTION"){   //if the project will be in production mode it will not use the source
    require("dotenv").config({path:"config/config.env"}) //imported dotenv and gave path of config.env
}

// Connecting to database
connectDatabase();

//cloudinary integration
cloudinary.config({ 
    cloud_name: process.env.Cloud_name,
    api_key: process.env.API_key,
    api_secret: process.env.API_secret
});

//upload a image in cloudinary


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


//use it where uploading image is necessary
    // Upload an image
    // const uploadResult = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg", {
    //     public_id: "shoes"
    // }).catch((error)=>{console.log(error)});
    // console.log(uploadResult);

//    // Upload an image
//    const uploadResult = await cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg", {
//     public_id: "shoes"
// }).catch((error)=>{console.log(error)});

// console.log(uploadResult);

// // Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url("shoes", {
//     fetch_format: 'auto',
//     quality: 'auto'
// });

// console.log(optimizeUrl);

// // Transform the image: auto-crop to square aspect_ratio
// const autoCropUrl = cloudinary.url("shoes", {
//     crop: 'auto',
//     gravity: 'auto',
//     width: 500,
//     height: 500,
// });

// console.log(autoCropUrl);    
// })();

