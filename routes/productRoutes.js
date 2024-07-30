const express = require("express");
const {isAuthenticated,authorizeRoles} = require("../middleware/auth");
const { getAllProducts, createProduct, updateProduct, deleteProduct, createReview ,getAllReviews, deleteReview, getProductDetail, getAdminProduct} = require("../controllers/productController");
const { upload } = require("../middleware/multer");


const router = express.Router();
router.route("/product").get(getAllProducts);
router.route("/product/:id").get(getProductDetail);
router.route("/product/reviews/:id").post(isAuthenticated,createReview);
router.route("/product/reviews/:id").get(getAllReviews);

// Admin Route
router.route("/admin/product").get(isAuthenticated, authorizeRoles("admin"), getAdminProduct);
router.route("/admin/product/new").post(isAuthenticated,authorizeRoles("admin"),createProduct); 
router.route("/admin/product/:id").put(isAuthenticated,authorizeRoles("admin"),updateProduct);
router.route("/admin/product/:id").delete(isAuthenticated,authorizeRoles("admin"),deleteProduct);
// router.route("/product/reviews").delete(deleteReview); --not working

module.exports = router;