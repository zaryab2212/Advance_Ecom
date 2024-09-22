const express = require("express");

const { verfiAdmin } = require("../Middleware/adminAccess");
const {
  addDiscountCoupon,
  getCouponDiscount,
  removeCoupon,
  getallCouponDiscount,
  createPaymentIntent,
} = require("../controllers/discount");
// const { singleUpload } = require("../Middleware/multer");

const router = express.Router();

// Stripe Payment
router.post("/payment_intent", createPaymentIntent);

router.post("/new-coupon", verfiAdmin, addDiscountCoupon);
router.post("/get-coupon", getCouponDiscount);
router.delete("/remove-coupon", verfiAdmin, removeCoupon);
router.get("/all-coupon", verfiAdmin, getallCouponDiscount);

module.exports = router;
