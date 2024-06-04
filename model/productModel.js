const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please,Give your name"],
        trim:true,  //leading and trailing whitespace characters in the input string are removed before being stored
    },
    description:{
        type:String,
        required:[true,"Please , describe the features of the product"],
    },
    price:{
        type:Number,
        required:[true,"Please Enter the price of the Product"],
        maxLength:[8,"cannot exceed 8 characters"],
    },
    rating:{
        type:Number,
        default:0,
    },
    images:[
        {
            public_id:{
                type:String,
                required:true,
            },
            url:{
                type:String,
                required:true,
            }
        }
    ],
    category:{
        type:String,
        required:true,
    },
    stock:{
        type:Number,
        required:[true,"Enter the stock"],
        maxLength:[8,"cannot exceed 8 charaters"],
    },
    numOfReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            user:{
                type:"String",
                ref:"User",
                required:true,
            },
            name:{
                type:String,
                ref:"User.name",
                required:true,
            },
            rating:{
                type:String,
                required:true,
            },
            comment:{
                type:String,
                required:true,
            },
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type: Date, 
        default:Date.now,
    },
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;