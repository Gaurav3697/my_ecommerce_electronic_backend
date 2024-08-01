const CryptoJS = require("crypto-js");
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError");
const { v4: uuidv4 } = require('uuid');

exports.payment = catchAsyncError(async (req, res, next) => {
    const price = req.price  // if not working req.body.price
    const uid = uuidv4()
    const message = `total_amount=${price},transaction_uuid=${uid},product_code=EPAYTEST`;
    const hash = CryptoJS.HmacSHA256(message, process.env.ESEWASECRET);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    res.status(200).json({
        signature: hashInBase64,
        uid
    })
})
