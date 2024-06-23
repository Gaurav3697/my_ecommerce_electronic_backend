const Order = require("../model/orderModels");
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../model/productModel");

exports.newOrder=catchAsyncError(async(req,res,next)=>{
    console.log("I am in");
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,  
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    });

    res.status(201).json({
        success:true,
        order
    })
})

//get single order
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email"); //populates the user field with additional user information
    if(!order){
        return next(new ErrorHandler("order doesn't exists with this id",400));
    }

    res.status(200).json({
        success:true,
        order
    })
})

//logged in users --// get logged in user  Orders --cannot read property of undefined _id
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });  
  
    res.status(200).json({ 
      success: true,
      orders,
    });
  });


// get all Orders --Admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();
  
    res.status(200).json({
      success: true,
      orders,
    });
  });

//Update Order Status -- cannot read reading of undefined forEach --error -- has to improve it
exports.updateOrderStatus = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("order doesn't exists with this id",400));
    }
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("You has Already delivered this order",400));
    }
    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
            //I think this function is formed till yet may be
            await updateStock(o.product, o.quantity); 
        });
    }
    order.orderStatus = req.body.status;
    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({
        validateBeforeSave:false,
    })
    res.status(200).json({
        success:true,
        order
    })
});


//DeleteOrder
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler("Order doesnot exist",400));
    }
    await order.deleteOne();
    res.status(200).json({
        success:true,
        message:"Order Removed" 
    })
})