const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cart");

const { verify,verifyAdmin} = require("../auth");


router.get("/get-cart", verify, cartController.getUserCart);

router.post("/add-to-cart", verify, cartController.addCart);

router.patch("/update-cart-quantity", verify, cartController.editCartItem);

router.patch("/:productId/remove-from-cart", verify, cartController.removeCartItem);

router.put("/clear-cart", verify, cartController.clearCart);

module.exports = router;