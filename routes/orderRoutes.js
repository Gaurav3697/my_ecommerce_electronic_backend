const express = require("express");
const {isAuthenticated,authorizeRoles} = require("../middleware/auth");
const { newOrder, getSingleOrder , myOrders , getAllOrders, updateOrderStatus, deleteOrder} = require("../controllers/orderController");


const router = express.Router();

router.route("/order/new").post(isAuthenticated,newOrder);
router.route("/order/:id").get(getSingleOrder);
// router.route("/order/me").get(myOrders);    //gives cast error?why
// router.route("/orders/me").get(myOrders);
router.route("/orders/all").get(getAllOrders);
router.route("/order/:id").put(updateOrderStatus);
router.route("/order/:id").delete(deleteOrder);


module.exports = router;

