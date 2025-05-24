const express = require("express");
const { addExpense,getMyExpenses } = require("../controllers/employee/employeeController");
const upload = require("../middlewares/uploadMiddleware");
const { protect,authorizeRoles  } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", protect,authorizeRoles('employee'), (req, res, next) => {next();
}, upload.single("receipt"), (req, res, next) => {next();
}, addExpense);

module.exports = router;
