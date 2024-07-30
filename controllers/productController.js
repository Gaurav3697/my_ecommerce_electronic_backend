const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeature = require("../utils/apiFeatures");
const cloudinary = require('cloudinary').v2;


//Get All Products
exports.getAllProducts=catchAsyncError(async(req,res,next)=>{
        const resultPerPage = 9;
        const productCount = await Product.countDocuments();
        const apiFeature = new ApiFeature(Product.find(),req.query).search().filter();
        apiFeature.pagination(resultPerPage);
        let products = await apiFeature.query;
        res.status(200).json({
            message:"Route is working",
            products,
            productCount,
            resultPerPage
        })
    })



//get Product Detail
exports.getProductDetail=catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    res.status(200).json({
        message:"Route is working",
        product,
    })
})

    //get all product --admin
    exports.getAdminProduct=catchAsyncError(async(req, res, next)=>{
        const products = await Product.find();
        res.status(200).json({
            message:"Route is working",
            products,
        })
    })

    //create Product
exports.createProduct = catchAsyncError(async (req, res, next) => {
    let images = [];
  
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
    //   const result = await cloudinary.v2.uploader.upload(images[i], {
    //     folder: "products",
    //   });
     const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",  //read on documentation of cloudinary
        resource_type: "image"
        // resource_type: "auto" //to send file other than image but in this case i will put image
     });

     imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
  
    const product = await Product.create(req.body);
  
    res.status(201).json({
      success: true,
      product,
    });
  });
  

//update product --admin
exports.updateProduct = catchAsyncError(async(req,res,next) =>{
        let product = await Product.findById(req.params.id);
        if(!product){
            return next(new ErrorHandler("product doesn't exists",400));
        }
        product = await Product.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            success:true,
            product
        })
    })

//delete Product --admin
exports.deleteProduct = catchAsyncError(async(req,res,next) =>{
        let product = await Product.findById(req.params.id);
        if(!product){
           return next(new ErrorHandler("product doesn't exists",400));
        }
        product = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success:true,
            message:"Deleted successfully"
        })
    })



//Review controller
// Create review --> Frontend is werking very well but review is not being submitted--I will debut it later
exports.createReview = catchAsyncError(async(req,res,next)=>{
    const {rating,comment} = req.body;
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),  // converting rating to number
        comment                 
    };
    const product = await Product.findById(req.params.id);
    const isReviewed = product.reviews.find((rev)=>
        rev.user.toString() === req.user._id.toString()
    )
    if(isReviewed){
        Product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString()){
                rev.rating = rating,
                rev.comment = comment
            }else{
                product.reviews.push(review);
                product.numOfReviews =product.reviews.length;
            }
            let sum = 0;
            product.reviews.forEach((rev) => {
              sum += rev.rating;
            });        
            product.rating = sum/product.reviews.length;
        })
    }
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        rating,
        comment
    })
})

// Get All Reviews of a Product
exports.getAllReviews = catchAsyncError(async(req,res,next)=>{
  const product = await Product.findById(req.query.id);
    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
})

// // Delete Review
// exports.deleteReview = catchAsyncError(async (req, res, next) => {
//     const product = await Product.findById(req.query.productId);
  
//     if (!product) {
//       return next(new ErrorHandler("Product not found", 404));
//     }
  
//     const reviews = product.reviews.filter(
//       (rev) => rev._id.toString() !== req.query.id.toString()  //filtering user Review
//     );
  
//     let avg = 0;
  
//     reviews.forEach((rev) => {
//       avg += rev.rating;
//     });
  
//     let ratings = 0;
  
//     if (reviews.length === 0) {
//       ratings = 0;
//     } else {
//       ratings = avg / reviews.length;
//     }
  
//     const numOfReviews = reviews.length;
  
//     await Product.findByIdAndUpdate(
//       req.query.productId,
//       {
//         reviews,
//         ratings,
//         numOfReviews,
//       },
//       {
//         new: true,
//         runValidators: true,
//         useFindAndModify: false,
//       }
//     );
  
//     res.status(200).json({
//       success: true,
//     });
//   });