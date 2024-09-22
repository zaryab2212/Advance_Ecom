const { myCache } = require("..");
const { Order } = require("../models/order");
const newError = require("../Utils/ErrorCls");
const { invalidateCache } = require("../Utils/invalidateCache");
const { reduceStock } = require("../Utils/reduceStock");

exports.addNewOrder = async (req, res, next) => {
  try {
    let order = await Order.create(req.body);
    await reduceStock(req.body.orderItems);
    await invalidateCache((product = true), (order = true), (admin = true));

    res.status(201).json({
      status: true,
      message: "order is places Succesfully",
      order,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

// Get All order for a user
exports.myOrders = async (req, res, next) => {
  try {
    let { id } = req.params;
    let orders = [];

    //finding orders where userId is same as params
    if (myCache.has(`myOrder-${id}`)) {
      orders = JSON.parse(myCache.get(`myOrder-${id}`));
    } else {
      orders = await Order.find({ user: id });
      myCache.set(`myOrder-${id}`, JSON.stringify(orders));
    }

    res.status(200).json({
      status: true,
      message: "user Orders fetched succesfully",
      orders,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

// Get All Admin Orders
exports.allOrders = async (req, res, next) => {
  try {
    let orders = [];

    //finding orders where userId is same as params
    if (false) {
      orders = JSON.parse(myCache.get(`allOrders`));
    } else {
      orders = await Order.find().populate("userId", "name");

      //myCache.set(`allOrders`, JSON.stringify(orders));
    }

    res.status(200).json({
      status: true,
      message: "All Orders fetched succesfully",
      orders,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

// Get Order Details
exports.getOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    let order = {};
    //finding orders where userId is same as params
    if (false) {
      order = JSON.parse(myCache.get(`allOrders`));
    } else {
      order = await Order.findById(id);

      //myCache.set(`allOrders`, JSON.stringify(orders));
    }

    res.status(200).json({
      status: true,
      message: "Order fetched succesfully",
      order,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

// Edit Orders
exports.EditOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order = await Order.findById(id);
    if (!order) {
      return next("order Not found", 400);
    }

    switch (order.status) {
      case "Processing":
        order.status = "Shipped";

        break;
      case "Shipped":
        order.status = "Delivered";

        break;

      default:
        order.status = "Delivered";

        break;
    }

    await order.save();

    await invalidateCache((product = false), (order = true), (admin = true));

    res.status(200).json({
      status: true,
      message: "order is processed  Succesfully",
      order,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

// Delete Orders
exports.removeOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order = await Order.findById(id);
    if (!order) {
      return next("order Not found", 400);
    }

    order.deleteOne();

    await invalidateCache((product = false), (order = true), (admin = true));

    res.status(200).json({
      status: true,
      message: "order is deleted  Succesfully",
      order,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};
