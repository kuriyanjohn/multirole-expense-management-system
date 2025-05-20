const express = require("express");
const { addExpense,getMyExpenses } = require("../controllers/employee/employeeController");
const upload = require("../middlewares/uploadMiddleware");
const { protect,authorizeRoles  } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", protect,authorizeRoles('employee'), (req, res, next) => {
  console.log(" Passed auth, about to hit multer");
  next();
}, upload.single("receipt"), (req, res, next) => {
  console.log(" Passed multer, about to hit controller");
  next();
}, addExpense);

module.exports = router;
