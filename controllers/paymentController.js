const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler")
const stripe = require('stripe')('sk_test_51PSf7KEWdJCbDqJFUsKVGYEXEqYmgxbwvvw3WEnotyLFbtYQ17tdFIY9ZqLVaY5Ym8kfqzZMXzYUVgt3BvuDnqpG00iWZhkXSW'); //when it worked exchange it with process.env.STRIPE_SECRET_KEY

exports.processPayment = catchAsyncError(async(req,res,next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount:req.body.amount,
        currency:"inr",
        metadata:{
            company:"Ecommerce"
        }
    });
    res.status(200).json({
        success:true,
        client_secret:myPayment.client_secret
    });
});

exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
    res.status(200).json({ stripeApiKey: 'pk_test_51PSf7KEWdJCbDqJFDtQDLKQsTsC8D5xh75ZoAk9P00Jwhn5kb3KmXJrg6620D7nfPlNaXXyKru2RaZa5UovOvbQc008a4TPUu9' });
  });

