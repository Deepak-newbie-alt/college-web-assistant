const express = require("express");
const router = express.Router();
const { markAttendance, getAllAttendance, getMyAttendance, deleteAttendance } = require("../controllers/attendanceController");
const { protect, isTeacher, isAdminOrTeacher } = require("../middleware/authMiddleware");

router.post("/mark_attendance", protect, isTeacher, markAttendance);
router.get("/get_all_attendance", protect, isAdminOrTeacher, getAllAttendance);
router.get("/get_my_attendance", protect, getMyAttendance);
router.delete("/delete_attendance/:id", protect, isAdminOrTeacher, deleteAttendance);

module.exports = router;
