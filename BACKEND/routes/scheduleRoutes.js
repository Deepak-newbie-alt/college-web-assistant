const express = require("express");
const { getSchedule, updateSchedule, createSchedule, deleteSchedule } = require("../controllers/scheduleController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/create_schedule", protect, isAdmin, createSchedule);
router.get("/:department/:year", getSchedule);
router.put("/:department/:year", protect, isAdmin, updateSchedule);
router.delete("/:department/:year",protect,isAdmin,deleteSchedule);

module.exports = router;
