const express = require("express");
const { addExpense,getMyExpenses } = require("../controllers/employee/employeeController");
const upload = require("../middlewares/uploadMiddleware");
const { protect,authorizeRoles  } = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(authorizeRoles('employee'));

router.post("/add", protect, (req, res, next) => {
  console.log("📥 Passed auth, about to hit multer");
  next();
}, upload.single("receipt"), (req, res, next) => {
  console.log("📎 Passed multer, about to hit controller");
  next();
}, addExpense);

module.exports = router;
