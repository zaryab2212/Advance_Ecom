const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    shippingCharges: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Processing", "Shipped", "Delivered"],
      default: "Processing",
    },

    orderItems: [
      {
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

exports.Order = mongoose.model("Order", orderSchema);
