const express = require("express");
const {isAuthenticated,authorizeRoles} = require("../middleware/auth");
const { getAllProducts, createProduct, updateProduct, deleteProduct, createReview ,getAllReviews, deleteReview} = require("../controllers/productController");


const router = express.Router();
router.route("/product").get(getAllProducts);
router.route("/product/new").post(isAuthenticated,authorizeRoles("admin"),createProduct);
router.route("/product/:id").put(isAuthenticated,authorizeRoles("admin"),updateProduct);
router.route("/product/:id").delete(isAuthenticated,authorizeRoles("admin"),deleteProduct);
router.route("/product/reviews").post(isAuthenticated,createReview);
router.route("/product/reviews").get(getAllReviews);
// router.route("/product/reviews").delete(deleteReview); --not workiing

module.exports = router;