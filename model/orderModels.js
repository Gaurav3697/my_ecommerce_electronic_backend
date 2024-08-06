const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: { type: String, require: true, },
        city: { type: String, require: true, },
        country: { type: String, require: true, },
        phoneNo: { type: Number, require: true, },
        pinCode: { type: Number, require: true, },
        state: { type: String, require: true, },
    },
    orderItem: [{
        image: { type: String, require: true, },
        name: { type: String, require: true, },
        price: { type: Number, require: true, },
        product: { type: mongoose.Schema.ObjectId, ref: "product", require: true, },
        quantity: { type: Number, require: true, },
    },],
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    // I has thought of user want to cash on delivery then we Won't get payment data
    payments: [{
        // paymentWay:{ type: String, required: true,},
        signature: { type: String ,required:true},
        status: { type: String,required: true, },
        paidAt: { type: Date, default:Date.now },
    },],
    itemPrice: { type: Number, required: true, Default: 0, },
    taxPrice: { type: Number, Default: 0, required: true, },
    shippingPrice: { type: Number, required: true, Default: 0, },
    totalPrice: { type: Number, required: true, Default: 0, },
    orderStatus: { type: String, required: true, default: "processing", },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

orderSchema.virtual("formattedCreatedAt").get(function () {
    return this.createdAt.toISOString().substring(0, 10); // Example: "2023-07-18"
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;