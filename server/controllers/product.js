const { myCache } = require("..");
const { Product } = require("../models/product");
const newError = require("../Utils/ErrorCls");
const fs = require("fs");
const { invalidateCache } = require("../Utils/invalidateCache");

//Add new Product
exports.addProduct = async (req, res, next) => {
  try {
    const { name, price, category, stock } = req.body;
    // const image = req.file;

    // if (!image) {
    //   return next(new newError("Picture is required", 400));
    // }

    if (!name || !price || !category || !stock) {
      fs.rm(image.path, () => console.log("image removed"));
      return next(new newError("Please Enter All the feilds", 400));
    }

    const product = await Product.create({
      name,
      price,
      category: category.toLowerCase(),
      // image: image?.path,
      stock,
    });

    if (!product) {
      return next(new newError("Adding new product failed. Please try again"));
    }

    // removing Cache from storage after creation of a new produc
    await invalidateCache((product = 1));

    res.status(201).json({
      status: true,
      message: "Product added succesfully",
      product,
    });
  } catch (error) {
    return next(
      new newError("An internal server Error occured adding new Product")
    );
  }
};

//Latest Product
exports.latestProducts = async (req, res, next) => {
  try {
    let products = [];
    // Check if product Chache already exist
    if (myCache.has("latestProducts")) {
      products = JSON.parse(myCache.get("latestProducts"));
    } else {
      const products = await Product.find().sort({ createdAt: 1 }).limit(5);
      myCache.set("latestProducts", JSON.stringify(products));
    }

    res.status(200).json({
      status: true,
      message: "Latest products fetched succesfully",
      products,
    });
  } catch (error) {
    return next(
      new newError("Internal Server Error fetching lastest products")
    );
  }
};

//Unique Categories
exports.getCategories = async (req, res, next) => {
  try {
    //Extact Unique Categor from all products
    let categories;
    if (myCache.has("categories")) {
      categories = JSON.parse(myCache.get("categories"));
    } else {
      categories = await Product.distinct("category");
      myCache.set("categories", JSON.stringify(categories));
    }

    res.status(200).json({
      status: true,
      message: "products Categories fetched succesfully",
      categories,
    });
  } catch (error) {
    return next(
      new newError("Internal Server Error fetching lastest products")
    );
  }
};

// Get All products for admin
exports.AllAdminProducts = async (req, res, next) => {
  try {
    let products;

    if (myCache.has("allProducts")) {
      products = JSON.parse(myCache.get("allProducts"));
    } else {
      products = await Product.find();
      myCache.set("allProducts", JSON.stringify(products));
    }

    res.status(200).json({
      status: true,
      message: "All products fetched succesfully",
      products,
    });
  } catch (error) {
    return next(new newError("Internal Server Error fetching All products"));
  }
};

//get Product details
exports.getProductDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (!id) {
      return next(new newError("Product Id not found", 400));
    }

    if (myCache.has(`singleProduct-${id}`)) {
      product = JSON.parse(myCache.get(`singleProduct-${id}`));
    } else {
      const product = await Product.findById(id);
      myCache.set(`singleProduct-${id}`, JSON.stringify(product));
    }

    if (!product) {
      return next(new newError("productnot found", 400));
    }

    res.status(200).json({
      status: true,
      message: "product details succesfully",
      product,
    });
  } catch (error) {
    return next(new newError("Internal Server Error getting product details"));
  }
};

// Update a product
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { name, price, category, stock } = req.body;
    const image = req.file;

    // if (!name || !price || !category || !stock) {
    //   fs.rm(image.path, () => console.log("image removed"));
    //   return next(new newError("Please Enter All the feilds", 400));
    // }

    //verify if the product exist

    const verifyProduct = await Product.findById(id);
    if (!verifyProduct) {
      return next(new newError("Product is unavailable", 400));
    }
    if (image) {
      fs.rm(verifyProduct.image, () => console.log("old Image removed"));
    }
    // Update the product
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        category: category.toLowerCase(),
        image: image?.path || verifyProduct.image,
        stock,
      },
      { new: true }
    );

    if (!product) {
      return next(new newError("Updating product failed. Please try again"));
    }

    // removing Cache from storage after updating the product produc
    await invalidateCache((product = 1));

    res.status(201).json({
      status: true,
      message: "Product updated succesfully",
      product,
    });
  } catch (error) {
    return next(
      new newError("An internal server Error occured updating Product")
    );
  }
};

// Deleting the Product
exports.removeProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new newError("Product Id not found", 400));
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return next(new newError("product not deleted", 400));
    }

    // removing image from local storage
    fs.rm(product.image, () => console.log("product photo deleted"));

    // removing Cache from storage after creation of a new produc
    await invalidateCache((product = 1));

    res.status(200).json({
      status: true,
      message: "product removed succesfully",
    });
  } catch (error) {
    return next(new newError("Internal Server Error deleting product"));
  }
};

// All Products with Filteration
exports.getAllProducts = async (req, res, next) => {
  try {
    const { search, category, priceMax, priceMin, sort, page } = req.query;
    let q = {};
    let PerPageItem = 10;
    let totalPage;

    if (category) {
      q = { ...q, category: category };
    }
    if (search) {
      const regex = new RegExp(search, "i");
      q = { ...q, name: { $regex: regex } };
    }
    if (priceMax || priceMin) {
      q = {
        ...q,
        price: {
          ...(priceMin && { $gte: priceMin }),
          ...(priceMax && { $lte: +priceMax }),
        },
      };
    }

    // Filteration for Sorting by Price and pagination Seachng and price

    const productPromise = Product.find(q)
      .sort(sort === "ace" ? { price: -1 } : { price: 1 })
      .limit(page * PerPageItem)
      .skip((page - 1) * PerPageItem);

    const [products, totalProducts] = await Promise.all([
      productPromise,
      Product.countDocuments(q), // Total number of doc after filteration
    ]);

    console.log(totalProducts);

    // couting total number of pages
    totalPage = Math.ceil(+totalProducts / PerPageItem);
    console.log(totalPage);

    res.status(200).json({
      status: true,
      message: "All products fetched succesfully",
      products,
      totalPage,
    });
  } catch (error) {
    return next(new newError("Internal Server Error fetching All products"));
  }
};
