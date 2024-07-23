const Product = require("../models/Product");
const auth = require("../auth");

module.exports.createProduct = (req, res) => {
  return Product.findOne({ name: req.body.name })
    .then((existingProduct) => {
      let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      });
      if (existingProduct) {
        return res.status(409).send({ error: "Product already exists" });
      }
      return newProduct
        .save()
        .then((savedProduct) => res.status(201).send({ product: savedProduct }))
        .catch((saveError) => {
          console.error("Error in saving the product: ", saveError);
          res.status(500).send({ error: "Failed to save the product" });
        });
    })
    .catch((findErr) => {
      console.error("Error in finding the producte: ", findErr);
      return res.status(500).send({ message: "Error in finding the product" });
    });
};

module.exports.retriveProduct = (req, res) => {
  return Product.find({})
    .then((product) => {
      if (product.length > 0) {
        return res.status(200).send({ products: product });
      } else {
        return res.status(200).send({ message: "No product found." });
      }
    })
    .catch((findErr) => {
      console.error("Error in finding all product: ", findErr);
      return res.status(500).send({ error: "Failed in finding product." });
    });
};


module.exports.retriveActiveProduct = (req, res) => {
  return Product.find({ isActive: true })
    .then((product) => {
      if (product.length > 0) {
        return res.status(200).send({ products: product });
      } else {
        return res
          .status(404)
          .send({ error: "There are no active product at the moment" });
      }
    })
    .catch((findErr) => {
      console.error("Error to fetch active product: ", findErr);
      return res.status(500).send({ error: "Failed to fetch active product." });
    });
};


module.exports.getProduct = (req, res) => {
  const productId = req.params.productId;
  return Product.findById(productId)
    .then((product) => {
      if (product) {
        return res.status(200).send({ product });
      } else {
        return res.status(404).send({ message: "Product not found." });
      }
    })
    .catch((findErr) => {
      console.error("Error to fetch product: ", findErr);
      return res.status(500).send({ error: "Failed to fetch product." });
    });
};

module.exports.updateProduct = (req, res) => {
  let updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  };
   return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then((product) => {
      if (product) {
        res.status(200).send({ message: "Product updated successfully",updatedProduct : product });
      } else {
        res.status(404).send(false);
      }
    })
    .catch((err) => res.status(500).send(err));
};


module.exports.archiveProduct = (req, res) => {
  let updateActiveField = {
    isActive: false,
  };
  const productId = req.params.productId;
  return Product.findByIdAndUpdate(productId, updateActiveField)
    .then((product) => {
      if (product) {
        res.status(200).send({
          message: `Product archived successfully`,
          archiveProduct: product,
        });
      } else {
        res.status(404).send({ error: `Product not found` });
      }
    })
    .catch((findErr) => {
      console.error("Error to archive product: ", findErr);
      return res.status(500).send({ error: "Failed to archive product." });
    });
};

module.exports.activateProduct = (req, res) => {
  let updateActiveField = {
    isActive: true,
  };
  const productId = req.params.productId;

  return Product.findByIdAndUpdate(productId, updateActiveField)
    .then((product) => {
      if (product) {
        res.status(200).send({
          message: `Product activated successfully`,
          activateProduct: product,
        });
      } else {
        res.status(404).send({ error: `Product not found` });
      }
    })
    .catch((findErr) => {
      console.error("Error to activating a product: ", findErr);
      return res.status(500).send({ error: "Failed to activating a product." });
    });
};

module.exports.searchProductsByName = async (req, res) => {
  try {
    const name = req.body.name;
    if (!name) {
      return res.status(400).send({ error: 'Name query parameter is required' });
    }

    const products = await Product.find({ name: { $regex: name, $options: 'i' } }); // Case-insensitive search
    if (products.length === 0) {
      return res.status(404).send({ message: 'No products found with that name' });
    }

    return res.status(200).send(products);
  } catch (error) {
    console.error('Error in searching products by name:', error);
    return res.status(500).send({ error: 'Failed to search products by name' });
  }
};

module.exports.searchProductsByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;
    if (!minPrice || !maxPrice) {
      return res.status(400).send({ error: 'Both minPrice and maxPrice query parameters are required' });
    }

    const products = await Product.find({
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) }
    });

    if (products.length === 0) {
      return res.status(404).send({ message: 'No products found within that price range' });
    }

    return res.status(200).send(products);
  } catch (error) {
    console.error('Error in searching products by price range:', error);
    return res.status(500).send({ error: 'Failed to search products by price range' });
  }
};