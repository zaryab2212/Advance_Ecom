const { myCache } = require("..");
const { Product } = require("../models/product");

exports.invalidateCache = async (product, order, admin) => {
  if (product) {
    let productKeyArr = [];
    const productIds = await Product.find().select("_id");

    productIds.forEach((e) => {
      productKeyArr.push(`singleProduct-${e.id}`);
    });

    myCache?.del([
      "latestProducts",
      "categories",
      "allProducts",
      ...productKeyArr,
    ]);
  }
};
