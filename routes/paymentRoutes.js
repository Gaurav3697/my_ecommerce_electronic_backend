const express = require("express");
const {isAuthenticated} = require("../middleware/auth");
const { processPayment, sendStripeApiKey } = require("../controllers/paymentController");

const router = express.Router();

router.route('/payment/process').post(isAuthenticated,processPayment)
router.route('/stripeApiKey').get(isAuthenticated,sendStripeApiKey)

module.exports = router;
