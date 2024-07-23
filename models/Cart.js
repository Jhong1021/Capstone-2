const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "UserID is required"],
  },
  cartItems: [
    {
      productId: {
        type: String,
        required: [true, "Product ID is required"],
      },
     quantity: {
        type: Number,
        required: [true, "Quantity is required"],
      },
      subtotal: {
        type: Number,
        required: [true, "Sub Total ID is required"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Total Price ID is required"],
  },
  orderedOn: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Cart", cartSchema);

