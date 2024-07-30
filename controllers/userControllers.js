const ErrorHandler = require("../utils/errorHandler");
const User = require("../model/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");
const { upload } = require("../middleware/multer");
const { uploadImage } = require("../utils/cloudinary");
// Register a User
// exports.registerUser = catchAsyncError(async (req, res, next) => {
//     const { name, email, password } = req.body;
//     const user = await User.create({
//         name,
//         email,
//         password,
//     });
//     sendToken(user, 201, res);
// });

// working without avatar
exports.registerUser = [
    upload.single('avatar'), // Multer middleware to handle file upload
    catchAsyncError(async (req, res, next) => {
        
        try {
            let avatar = null;
            const { name, email, password} = req.body;
            if (req.file) {
                const uploadResult = await uploadImage(req.file.path);
                avatar = {
                    public_id: uploadResult.public_id,
                    url: uploadResult.secure_url,
                };
            }
            const user = await User.create({
                name,
                email,
                password,
                avatar // Include the avatar information
            });

            sendToken(user, 200, res);
        } catch (error) {
            next(error);
        }
    })
];


//login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Enter Both Email and Password", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid user or password", 400));
    }
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email or Password", 400));
    }
    sendToken(user, 200, res);
})

//logout user
exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

//forget Password
exports.forgetPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User doesn't exists", 400));
    }
    //Get reset Password Token 
    const resetToken = user.getPasswordToken();
    await user.save({ validateBeforeSave: false });
    // const resetPasswordUrl = `${req.protocol}://${req.get( 
    //     "host"
    // )}/password/reset/${resetToken}`;
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password reset Token is:-
        \n\n ${resetPasswordUrl} \n\n
        If you havenot requested it, You can Ignore it `;

    try {
        await sendEmail({
            email: user.email,
            subject: `Password recovery`,
            message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }
});

//reset password function
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken
        // ,resetPasswordExpire:{$gt:Date.now()},
    })
    if (!user) {
        return next(new ErrorHandler("reset Password token is invalid or expire", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password dindnot matched", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
})

//write a get user detail function to get the detail of user
exports.getUserDetail = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
})

//Update user Password
exports.UpdatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    const isMatchPassword = user.comparePassword(req.body.oldPassword);
    if (!isMatchPassword) {
        return next(new ErrorHandler("Wrong Password", 400));
    }
    if (req.body.newPassword != req.body.confirmPassword) {
        return next(new ErrorHandler("Your Passwords are not matching", 400));
    }
    user.password = req.body.newPassword;
    await user.save(); //this will bcrypt the new password
    sendToken(user, 200, res);
})

//Update User Profile
exports.updateUserProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true, //This option ensures that Mongoose runs the validators specified in the schema during the update operation
        useFindAndModify: false //below mongoose 5 it was good practice but now its is setbydefault
    });
    sendToken(user, 200, res);
})

// admin functionalities

//Make a function to get all users
exports.getAllUser = catchAsyncError(async (req, res, next) => { //not tested
    const user = await User.find();
    res.status(200).json({
        success: true,
        user
    })
})

//Make a function to get single users
exports.getSingleUser = catchAsyncError(async (req, res, next) => { //not tested
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 400));
    }
    res.status(200).json({
        success: true,
        user
    })
})

//Make a function to update users role --admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => { //not tested
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        user
    })
})

//Make a function to delete users -- admin features
exports.deleteUser = catchAsyncError(async (req, res, next) => {   //not tested
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler("User not found", 400));
    }
    await user.deleteOne();
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})

// just increasing LOC
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    // const orders = await Order.find({ user: req.user.id });  //it it getting id
  
    res.status(200).json({ 
      success: true,
      user,
    });
  });
