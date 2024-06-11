const validator = require("validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please,Enter your Name"],
    },
    email:{
        type:String,
        required:[true,"Please,Enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password:{
        type:String,
        required:[true,"Please,Enter Password"],
        select: false,
    },
    avatar:{
            public_id:{
                type:String,
                // required:true,
            },
            url:{
                type:String,
                // required:true,
            }
        },
        role:{
            type:String,
            default: "user",
        },
        createdAt: {
            type: Date,
            default: Date.now,
          },
        resetPasswordToken:String,
        restetPasswordExpire:Date,

    })

    //Before saving the password this function will run to hash the password
    userSchema.pre("save",async function(next){
        if(!this.isModified("password")){
            next();
        }
        this.password =await bcrypt.hash(this.password,10);
    })

    //jwt Token or cookie fuction
    userSchema.methods.getJWTToken = function () {
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
          expiresIn: 15*60*60*1000,
        });
      };

    //Compare password which willl be used to check if the user has entered correct password or not
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  //get password reset token
  userSchema.methods.getPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 15*60*1000;
    return resetToken;
  }


    module.exports = mongoose.model("User",userSchema);
