const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require("../auth");

module.exports.checkout = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      return res.status(403).send({ error: 'Admin is forbidden' });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.cartItems.length === 0) {
      return res.status(404).send({ error: 'No Items to Checkout' });
    }

    const order = new Order({
      userId: req.user.id,
      productsOrdered: cart.cartItems,
      totalPrice: cart.totalPrice,
      createdAt: new Date()
    });

    await order.save();

    cart.cartItems = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(201).send({ message: 'Ordered Successfully'});
  } catch (error) {
    console.error('Error in checking out:', error);
    return res.status(500).send({ error: 'Failed to place order' });
  }
};


module.exports.getUserOrders = async (req, res) => {
   if (req.user.isAdmin === true) {
      return res.status(403).send({ error: 'Admin is forbidden' });
    }
  try {
    let userID = req.user.id;

    const orders = await Order.find({ userId: userID });
    if (orders.length === 0) {
      return res.status(404).send({ message: 'No orders found for this user' });
    }

    return res.status(200).send({ orders });
  } catch (error) {
    console.error('Error in retrieving user orders:', error);
    return res.status(500).send({ error: 'Failed to fetch user orders' });
  }
};


module.exports.getAllOrders = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).send({ error: 'Only admin can access this route' });
    }

    const orders = await Order.find();
    return res.status(200).send({ orders });
  } catch (error) {
    console.error('Error in retrieving all orders:', error);
    return res.status(500).send({ error: 'Failed to fetch orders' });
  }
};