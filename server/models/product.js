const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      requires: [true, "Please Enter the name"],
    },
    image: {
      type: String,
       requires: [true, "Please Enter the image"],
    },
    category: {
      type: String,
      requires: [true, "Please Enter the category"],
    },
    stock: {
      type: Number,
      requires: [true, "Please Enter the stock  "],
    },
    price: {
      type: Number,
      requires: [true, "Please Enter the price"],
    },
  },
  { timestamps: true }
);

exports.Product = mongoose.model("Product", productSchema);
