const express = require("express");

const router = express.Router();

const productController = require("../controllers/product");

const { verify,verifyAdmin} = require("../auth");

router.post("/", verify, verifyAdmin,productController.createProduct);

router.get("/all", verify, verifyAdmin,productController.retriveProduct);

router.get("/active",productController.retriveActiveProduct);

router.get("/:productId",productController.getProduct);

router.patch("/:productId/update", verify, verifyAdmin,productController.updateProduct);

router.patch("/:productId/archive", verify, verifyAdmin,productController.archiveProduct);

router.patch("/:productId/activate", verify, verifyAdmin,productController.activateProduct);

router.post("/products/search-by-name", productController.searchProductsByName);

router.post("/products/search-by-price", productController.searchProductsByPriceRange);



module.exports = router;