const express = require("express");

const { verfiAdmin } = require("../Middleware/adminAccess");
const {
  revenueStats,
  userStats,
  productStats,
  CatPercentage,
  genderRatio,
  lastOrder,
  orderFullfillmentRatio,
  productCategoryRatio,
  stockAvailibility,
  sixMonthsRecords,
} = require("../controllers/dashBoard");

const router = express.Router();

router.get("/revenue", revenueStats);
router.get("/user", userStats);
router.get("/products", productStats);
router.get("/category", CatPercentage);
router.get("/genderRatio", genderRatio);
router.get("/lastOrders", lastOrder);
router.get("/orderFullfillmentRatio", orderFullfillmentRatio);
router.get("/productCategoryRatio", productCategoryRatio);
router.get("/stockAvailibility", stockAvailibility);
router.get("/sixMonth", sixMonthsRecords);

module.exports = router;
