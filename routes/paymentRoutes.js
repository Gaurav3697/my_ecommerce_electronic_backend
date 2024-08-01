const express = require("express");
const {isAuthenticated} = require("../middleware/auth");
const { payment } = require("../controllers/paymentController");

const router = express.Router();

router.route('/orders/payment').post(isAuthenticated,payment)

module.exports = router;
