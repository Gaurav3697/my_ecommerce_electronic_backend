const express = require("express");
const { registerUser, loginUser, logoutUser, forgetPassword, resetPassword, getUserDetail, UpdatePassword, updateUserProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userControllers");
const {isAuthenticated,authorizeRoles} = require("../middleware/auth");

const router = express.Router();

router.route('/register').post( registerUser);
router.route("/login").post( loginUser);
router.route("/logout").get( isAuthenticated,logoutUser);
router.route("/password/forgot").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticated,getUserDetail);
router.route("/updatePassword").put(isAuthenticated,UpdatePassword);
router.route("/updateProfile").put(isAuthenticated,updateUserProfile);

// admin
router.route("/admin/getAllUser").get(isAuthenticated,authorizeRoles("admin"),getAllUser);
router.route("/admin/:id").get(isAuthenticated,authorizeRoles("admin"),getSingleUser);
router.route("/admin/:id").put(isAuthenticated,authorizeRoles("admin"),updateUserRole);
router.route("/admin/:id").delete(isAuthenticated,authorizeRoles("admin"),deleteUser);

module.exports = router;