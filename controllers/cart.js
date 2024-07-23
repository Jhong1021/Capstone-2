const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require("../auth");

module.exports.addCart = async (req, res) => {
   if (req.user.isAdmin === true) {
      return res.status(403).send({ error: 'Admin is forbidden' });
    }

  const { productId, quantity, subtotal } = req.body;
  const userId = req.user.id
  try {
    let cart = await Cart.findOne({userId});

    if (!cart) {
      cart = new Cart({
        userId,
        cartItems: [{ productId, quantity, subtotal }],
        totalPrice: subtotal,
        orderedOn: new Date()
      });
    } else {
      const cartItem = cart.cartItems.find(item => item.productId.toString() === productId);

      if (cartItem) {
        cartItem.quantity += quantity;
        cartItem.subtotal += subtotal;
      } else {
        cart.cartItems.push({ productId, quantity, subtotal });
      }   

      cart.totalPrice += subtotal;
    }

    await cart.save();
    res.status(200).send({ message: 'Item added to cart successfully',
      cart});
  } catch (err) {
    console.log('Error in adding item to cart', err)
    res.status(500).send({error: 'Error in adding item to cart'});
  }
};


module.exports.getUserCart = (req, res) => {

   if (req.user.isAdmin === true) {
      return res.status(403).send({ error: 'Admin is forbidden' });
    }
  let userID = req.user.id;

  return Cart.find({ userId: userID })
    .then((cart) => {
      if (cart.length > 0) {
        return res.status(200).send({ cart });
      }

      return res.status(404).send({ error: "User not found" });
    })
    .catch((findErr) => {
      console.error(`Error in finding cart:`, findErr);
      return res.status(500).send({ error: "'Failed to fetch cart" });
    });
};

module.exports.editCartItem = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).send({ error: 'Admin is forbidden' });
    }

    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).send({ error: 'Product ID and quantity are required' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).send({ error: 'Cart not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ message: 'Product not found!' });
    }

    let cartItem = cart.cartItems.find(item => item.productId === productId);
    if (!cartItem) {
      return res.status(404).send({ error: 'Cart item not found' });
    }

    const oldSubtotal = cartItem.subtotal;
    cartItem.quantity = quantity;
    cartItem.subtotal = product.price * quantity;
    
    cart.totalPrice = cart.totalPrice - oldSubtotal + cartItem.subtotal;

    await cart.save();

    return res.status(200).send({ message: 'Item quantity updated successfully', updatedCart: cart });
  } catch (error) {
    console.error('Error in editing cart item quantity:', error);
    return res.status(500).send({ error: 'Failed to edit cart item quantity' });
  }
};


module.exports.removeCartItem = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).send({ error: 'Admin is forbidden' });
    }

    const { productId } = req.params;

    if (!productId) {
      return res.status(400).send({ error: 'Product ID is required' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).send({ error: 'Cart not found' });
    }

    const cartItemIndex = cart.cartItems.findIndex(item => item.productId === productId);
    if (cartItemIndex === -1) {
      return res.status(404).send({ error: 'Cart item not found' });
    }

    const cartItem = cart.cartItems[cartItemIndex];
    cart.totalPrice -= cartItem.subtotal;
    
    cart.cartItems.splice(cartItemIndex, 1);

    await cart.save();

    return res.status(200).send({ message: 'Item removed from cart successfully', updatedCart: cart });
  } catch (error) {
    console.error('Error in removing cart item:', error);
    return res.status(500).send({ error: 'Failed to remove cart item' });
  }
};


module.exports.clearCart = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).send({ error: 'Admin is forbidden' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).send({ error: 'Cart not found' });
    }

    cart.cartItems = [];
    cart.totalPrice = 0;

    await cart.save();

    return res.status(200).send({ message: 'Cart cleared successfully', cart: cart });
  } catch (error) {
    console.error('Error in clearing cart:', error);
    return res.status(500).send({ error: 'Failed to clear cart' });
  }
};