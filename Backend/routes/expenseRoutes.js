const express = require("express");
const { addExpense,getMyExpenses } = require("../controllers/employee/employeeController");
const upload = require("../middlewares/uploadMiddleware");
const { protect,authorizeRoles  } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/add",
  protect,
  authorizeRoles('employee'),
  upload.single("receipt"),
  addExpense
);

module.exports = router;
