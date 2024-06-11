const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeature = require("../utils/apiFeatures");
const isAuthenticated = require("../middleware/auth.js")

//Get All Products
exports.getAllProducts=catchAsyncError(async(req,res,next)=>{
        const resultPerPage = 10;
        const productCount = await Product.countDocuments();
        const apiFeature = new ApiFeature(Product.find(),req.query).search().filter();
        apiFeature.pagination(resultPerPage);
        let products = await apiFeature.query;
        res.status(200).json({
            message:"Route is working",
            products,
            productCount
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

//create a product --admin
exports.createProduct = catchAsyncError(async(req,res,next) =>{
    req.body.user = req.user.id;  //it will send user id  to the req.body.user
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
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

// Create review 
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