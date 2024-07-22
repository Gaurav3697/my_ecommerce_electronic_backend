const express = require("express");
const {isAuthenticated,authorizeRoles} = require("../middleware/auth");
const { newOrder, getSingleOrder , myOrders , getAllOrders, updateOrderStatus, deleteOrder} = require("../controllers/orderController");


const router = express.Router();

router.route("/order/new").post(isAuthenticated,newOrder);
router.route("/order/:id").get(getSingleOrder);
// router.route("/order/me").get(myOrders);    //gives cast error?why
router.route("/orders/me").get(isAuthenticated,myOrders); //always use authenticated middleware when user id id needed

// admin routes
router.route("/orders/all").get(isAuthenticated,authorizeRoles("admin"),getAllOrders);
router.route("/order/:id").put(isAuthenticated,authorizeRoles("admin"),updateOrderStatus);
router.route("/order/:id").delete(isAuthenticated,authorizeRoles("admin"),deleteOrder);


module.exports = router;

