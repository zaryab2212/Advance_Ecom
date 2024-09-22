const express = require("express");
const { singleUpload } = require("../Middleware/multer");
const {
  addProduct,
  latestProducts,
  getCategories,
  AllAdminProducts,
  getProductDetails,
  updateProduct,
  removeProduct,
  getAllProducts,
} = require("../controllers/product");

const router = express.Router();

router.post("/add", addProduct);

router
  .get("/adminAllProducts", AllAdminProducts)
  .get("/:id", getProductDetails)
  .get("/latest", latestProducts)
  .get("/categories", getCategories)
  .get("/", getAllProducts);

router.put("/:id", singleUpload, updateProduct);
router.delete("/:id", removeProduct);

module.exports = router;
