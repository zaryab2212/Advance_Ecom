const express = require("express");
const {
  createUser,
  getAllUsers,
  getSingleUser,
  removeUser,
} = require("../controllers/user");
const { verfiAdmin } = require("../Middleware/adminAccess");
const router = express.Router();

router.post("/create", createUser);
router.get("/all", getAllUsers);
router.get("/:id", getSingleUser);
router.delete("/remove", verfiAdmin, removeUser);

module.exports = router;
