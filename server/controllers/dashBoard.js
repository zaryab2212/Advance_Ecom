const { Order } = require("../models/order");
const { Product } = require("../models/product");
const { User } = require("../models/user");
const newError = require("../Utils/ErrorCls");

// Variables
let today = new Date();

let lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
let lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
let thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
let thisMonthEnd = today;

//for revenue status f
exports.revenueStats = async (req, res, next) => {
  try {
    let totalOrders = await Order.find().select("total");

    if (!totalOrders) {
      return next(new newError("No Orders found - zero revenue"));
    }

    // total revenew as whole
    let totalAmount = totalOrders
      .reduce((accu, ite) => accu + ite.total, 0)
      .toFixed(0);

    // check growth from last month

    let lastMonthOrders = await Order.find({
      createdAt: {
        $gte: new Date(lastMonthStart),
        $lte: new Date(lastMonthEnd),
      },
    }).select("total");

    // total order for last mont
    let lastMonthTotal = lastMonthOrders
      .reduce((accu, ite) => accu + ite.total, 0)
      .toFixed(0);

    let thisMonthOrders = await Order.find({
      createdAt: {
        $gte: new Date(thisMonthStart),
        $lte: new Date(thisMonthEnd),
      },
    }).select("total");

    // total order for This mont
    let thisMonthTotal = thisMonthOrders
      .reduce((accu, ite) => accu + ite.total, 0)
      .toFixed(0);

    let salePercentage =
      ((thisMonthTotal - lastMonthTotal) / lastMonthTotal || 0) * 100;

    res.status(200).json({
      status: true,
      salePercentage,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

// total users
exports.userStats = async (req, res, next) => {
  try {
    let totalUsers = await User.countDocuments();

    if (!totalUsers) {
      return next(new newError("No user found - no user came"));
    }

    // check growth from last month

    let lastMonthUser = await User.countDocuments({
      createdAt: {
        $gte: new Date(lastMonthStart),
        $lte: new Date(lastMonthEnd),
      },
    });

    let thisMonthUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(thisMonthStart),
        $lte: new Date(thisMonthEnd),
      },
    });

    let UserPercentage = Math.round(
      ((thisMonthUsers - lastMonthUser) / lastMonthUser) * 100
    );

    res.status(200).json({
      status: true,
      UserPercentage,
      totalUsers,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

// total Products Stats
exports.productStats = async (req, res, next) => {
  try {
    let totalProducts = await Product.countDocuments();

    if (!totalProducts) {
      return next(new newError("No user found - no user came"));
    }

    // check growth from last month

    let lastMonthProducts = await Product.countDocuments({
      createdAt: {
        $gte: new Date(lastMonthStart),
        $lte: new Date(lastMonthEnd),
      },
    });

    let thisMonthProducts = await Product.countDocuments({
      createdAt: {
        $gte: new Date(thisMonthStart),
        $lte: new Date(thisMonthEnd),
      },
    });

    let ProductsPercentage = Math.round(
      ((thisMonthProducts - lastMonthProducts) / lastMonthProducts) * 100
    );

    res.status(200).json({
      status: true,
      ProductsPercentage,
      totalProducts,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

// Category percentage
exports.CatPercentage = async (req, res, next) => {
  try {
    let allCategories = await Product.distinct("category");
    let totalProducts = await Product.countDocuments();

    if (!allCategories) {
      return next(new newError("No category found - "));
    }

    let totalCatsCount = allCategories.map(async (cat) => {
      return {
        [cat]: await Product.countDocuments({
          category: cat,
        }),
      };
    });

    let eachCatCount = await Promise.all(totalCatsCount);
    let CatPercentage = {};
    for (let i = 0; i < eachCatCount.length; i++) {
      let keys = Object.keys(eachCatCount[i])[0];
      CatPercentage = {
        ...CatPercentage,
        [keys]: Math.round(
          (Object.values(eachCatCount[i])[0] / totalProducts) * 100
        ),
      };
    }

    res.status(200).json({
      status: true,
      eachCatCount,
      allCategories,
      CatPercentage,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

//Genger Ratio
exports.genderRatio = async (req, res, next) => {
  try {
    let [maleCount, femaleCount, transgenderCount] = await Promise.all([
      User.countDocuments({ gender: "male" }),
      await User.countDocuments({ gender: "female" }),
      await User.countDocuments({ gender: "transgender" }),
    ]);

    let totalUsers = maleCount + femaleCount + transgenderCount;

    let malePercentage = (maleCount / totalUsers) * 100;
    let femalePercentage = (femaleCount / totalUsers) * 100;
    let transgenderPercentage = (transgenderCount / totalUsers) * 100;

    res.status(200).json({
      status: true,
      malePercentage,
      femalePercentage,
      transgenderPercentage,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

exports.lastOrder = async (req, res, next) => {
  try {
    let ordersWithDetails = await Order.find()
      .select(["total", "discount", "status", "orderItems"])
      .limit(5);

    const orders = ordersWithDetails.map((i) => {
      return {
        ...i._doc,
        orderItems: i.orderItems.length,
      };
    });

    res.status(200).json({
      status: true,
      orders,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

// Pie  product Category
exports.productCategoryRatio = async (req, res, next) => {
  try {
    let allCategories = await Product.distinct("category");
    let totalProducts = await Product.countDocuments();

    if (!allCategories) {
      return next(new newError("No category found - "));
    }

    let tryr = allCategories.map(async (e, i) => {
      return { [e]: await Product.countDocuments({ category: e }) };
    });

    let promiseArr = await Promise.all(tryr);

    let categoryPercentage = {};

    promiseArr.forEach((e, i) => {
      categoryPercentage = {
        ...categoryPercentage,
        [Object.keys(e)[0]]: Math.round(
          (Object.values(e)[0] / totalProducts) * 100
        ),
      };
    });

    res.status(200).json({
      status: true,
      categoryPercentage,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

exports.orderFullfillmentRatio = async (req, res, next) => {
  try {
    let [totalOrders, fullFilledOrders, pendingOrders, deliveredOrders] =
      await Promise.all([
        Order.countDocuments(), // for all orders
        Order.countDocuments({ status: "Shipped" }), // for Shipped orders
        Order.countDocuments({ status: "Processing" }), // for Processing orders
        Order.countDocuments({ status: "Delivered" }), // for Delivered orders
      ]);

    let fullFilledRatio =
      Math.round((fullFilledOrders / totalOrders) * 100) || 0;
    let pendingRatio = Math.round((pendingOrders / totalOrders) * 100) || 0;
    let deliveredRatio = Math.round((deliveredOrders / totalOrders) * 100) || 0;

    res.status(200).json({
      status: true,
      message: "total percentage of fullFilled orders",
      fullFilledRatio,
      deliveredRatio,
      pendingRatio,
    });
  } catch (error) {
    return next(new newError(error.message, 400));
  }
};

//  stock Availiblity
exports.stockAvailibility = async (req, res, next) => {
  try {
    const totalProductsStock = await Product.countDocuments(); // for total prodcts
    const totalProductsOutOfStock = await Product.countDocuments({
      stock: { $lte: 0 },
    }); // for total out of stock  products

    res.status(200).json({
      status: true,
      message: "total percentage of fullFilled orders",
      inStock: totalProductsStock - totalProductsOutOfStock,
      outOfStock: totalProductsOutOfStock,
    });
  } catch (error) {
    return next(new newError(error.message, 400));
  }
};

//  last six month records
exports.sixMonthsRecords = async (req, res, next) => {
  try {
    // Six Month user
    let sixMonthUser = await User.find({
      createdAt: {
        $gt: new Date(
          today.getMonth() >= 6 ? today.getFullYear() : today.getFullYear() - 1,
          today.getMonth() - 6,
          today.getDay()
        ),
      },
    });

    // six months order
    let sixMonthOrders = await Order.find({
      createdAt: {
        $gt: new Date(
          today.getMonth() >= 6 ? today.getFullYear() : today.getFullYear() - 1,
          today.getMonth() - 6,
          today.getDay()
        ),
      },
    });
    // six months product
    let sixMonthProducts = await Product.find({
      createdAt: {
        $gt: new Date(
          today.getMonth() >= 6 ? today.getFullYear() : today.getFullYear() - 1,
          today.getMonth() - 6,
          today.getDay()
        ),
      },
    });

    res.status(200).json({
      stats: 200,
      message: "six Moth data",
      sixMonthUser,
      sixMonthOrders,
      sixMonthProducts,
    });
  } catch (error) {
    return next(new newError(error.message, 400));
  }
};
