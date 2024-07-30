const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    shippingInfo:{
        adress:{type:String,require:true,},
        city:{type:String,require:true,},
        state:{type:String,require:true,},
        country:{type:String,require:true,},
        pinCode:{type:Number,require:true,},
        PhoneNo:{type:Number,require:true,}
    },
    orderItem:{
        name:{type:String,require:true,},
        price:{type:Number,require:true,},
        quantity:{type:Number,require:true,},
        product:{type:mongoose.Schema.ObjectId,ref:"product",require:true,},
        image:{type:String,require:true,},
    },
    user:{
        type:String,
        ref:"User",
        required:true,
    },
   paymentInfo:{
    id:{type:String,required:true},
    Status:{type:String,required:true},
    paidAt:{type:Date,required:true},
   },
    itemPrice:{type:Number,required:true,Default:0,},
    taxPrice:{type:Number,Default:0,required:true,},
    shippingPrice:{type:Number,required:true,Default:0,},
    totalPrice:{type:Number,required:true,Default:0,},
   orderStatus:{type:String,required:true,default:"processing",},
   deliveredAt:Date,
   createdAt:{
    type:Date,
    default:Date.now,
   }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;