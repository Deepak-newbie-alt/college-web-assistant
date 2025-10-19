const express = require("express");
const {
  getLeaveRequests,
  applyLeave,
  getMyLeaves,
  updateLeaveStatus
} = require("../controllers/leaveController");
const { protect, isAdminOrTeacher } = require("../middleware/authMiddleware");

const router = express.Router();

// Student apply leave
router.post("/apply", protect, applyLeave);

// Student view personal leaves
router.get("/my_leaves", protect, getMyLeaves);

// Admin/Teacher view all leave requests
router.get("/get_leave_requests", protect, isAdminOrTeacher, getLeaveRequests);

// Admin/Teacher update leave status
router.put("/update_status/:id", protect, isAdminOrTeacher, updateLeaveStatus);

module.exports = router;
