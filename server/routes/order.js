const express = require("express");
const {
  addNewOrder,
  myOrders,
  allOrders,
  getOrderDetails,
  EditOrder,
  removeOrder,
} = require("../controllers/order");
const { verfiAdmin } = require("../Middleware/adminAccess");
// const { singleUpload } = require("../Middleware/multer");

const router = express.Router();

router.post("/new", addNewOrder);
router.get("/myOrder", myOrders);
router.get("/all", allOrders);
router.get("/:id", verfiAdmin, getOrderDetails);
router.put("/:id", verfiAdmin, EditOrder);
router.delete("/:id", verfiAdmin, removeOrder);

module.exports = router;
