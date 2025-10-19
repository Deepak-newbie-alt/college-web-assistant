const Leave = require("../models/leave");

// STUDENT: Apply for leave -- personalized to authenticated user
const applyLeave = async (req, res) => {
  try {
    const { reason, fromDate, toDate } = req.body;
    const userId = req.user._id;  // set by 'protect' middleware

    if (!reason || !fromDate || !toDate) {
      return res.status(400).json({ message: "Reason, fromDate, and toDate are required." });
    }

    const leave = await Leave.create({
      userId,
      reason,
      fromDate,
      toDate,
    });

    res.status(201).json({ message: "Leave submitted", leave });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN/TEACHER: See all leave requests with full student info
const getLeaveRequests = async (req, res) => {
  try {
    // Populates userId with name, department, year, email, etc
    const leaves = await Leave.find().populate("userId", "name department year email");
    res.status(200).json({ message: "Leaves fetched successfully", leaves });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ADMIN/TEACHER: Update leave status
const updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  try {
    const updatedLeave = await Leave.findByIdAndUpdate(id, { status }, { new: true })
      .populate("userId", "name department year email");
    if (!updatedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    res.status(200).json({ message: "Leave updated successfully", updatedLeave });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// STUDENT: Get my leaves
const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({ userId: req.user._id });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { applyLeave, getLeaveRequests, updateLeaveStatus, getMyLeaves };
