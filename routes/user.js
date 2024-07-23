const express = require("express");

const router = express.Router();

const userController = require("../controllers/user");

const productController = require("../controllers/product");

const { verify,verifyAdmin, isLoggedIn } = require("../auth");

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getDetails);

router.patch('/:id/set-as-admin', verify, verifyAdmin, userController.updateUserToAdmin);

router.patch("/update-password", verify, userController.updatePassword);




module.exports = router;