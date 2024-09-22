const { Product } = require("../models/product");
const newError = require("./ErrorCls");

exports.reduceStock = (orderItems = []) => {
  orderItems.forEach(async (product) => {
    let pro = await Product.findById(product.id);
    if (!pro) {
      return new newError("product not found", 400);
    }

    pro.stock -= product.quantity;
    await pro.save();
  });
};
