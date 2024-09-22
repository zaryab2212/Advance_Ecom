// const { stripe } = require("../");
const { Discount } = require("../models/discount");
const newError = require("../Utils/ErrorCls");
const Stripe = require("stripe");

let stripe = new Stripe(
  "sk_test_51Njf8DSEgSLCI1a7ELXN1EF0U72UotJDlmGnHo7WxKbyHM3PCFfp8qTyeJ5sr4YHdbP5gJE8Y5fw7Ae14uz9dO3900q1x8F8w2"
);

//for Adding discount Coupon
exports.addDiscountCoupon = async (req, res, next) => {
  try {
    let coupon = await Discount.create({ ...req.body });
    if (!coupon) return next(new newError("coupon creation err", 400));

    res.status(201).json({
      success: true,
      message: "Discount coupon created successfully",
      coupon,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

// for verify token
exports.getCouponDiscount = async (req, res, next) => {
  try {
    let discount = await Discount.findOne({ code: req.body.code });
    if (!discount) {
      return next(new newError("Invalid Coupon code", 400));
    }
    res.status(200).json({
      status: 200,
      message: "coupon found succesfully",
      discount: discount.amount,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

//for aall vaiable discount coupon
exports.getallCouponDiscount = async (req, res, next) => {
  try {
    let coupons = await Discount.find();
    if (discount.length < 0) {
      return next(new newError("No Coupon found in data base", 400));
    }
    res.status(200).json({
      status: 200,
      message: "coupons found succesfully",
      coupons,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

//for deleting discount coupon
exports.removeCoupon = async (req, res, next) => {
  try {
    let coupon = await Discount.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return next(new newError("No Coupon found", 400));
    }

    res.status(200).json({
      status: 200,
      message: "coupon removed succesfully",
      coupon,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};

// Genereating Payment intest
exports.createPaymentIntent = async (req, res, next) => {
  console.log(stripe);
  try {
    const { amount } = req.body;

    if (!amount) {
      return next(new newError("could not find amount"), 100);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 200,
      currency: "usd",
    });

    res.status(200).json({
      status: 200,
      message: "coupon removed succesfully",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(new newError(error.message, 400));
  }
};
