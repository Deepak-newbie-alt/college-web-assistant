const Attendance = require("../models/attendance");

// Optional: check for duplicate attendance before allowing new entry, per day/student

const markAttendance = async (req, res) => {
  try {
    const { studentId, status } = req.body;
    // Prevent duplicate marks for same student/date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const existing = await Attendance.findOne({
      studentId,
      date: { $gte: today }
    });
    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for today." });
    }
    const attendance = await Attendance.create({ studentId, status });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find().populate("studentId", "name");
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;
    const attendanceRecords = await Attendance.find({ studentId });
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const attendanceId = req.params.id;
    const deletedAttendance = await Attendance.findByIdAndDelete(attendanceId);
    if (!deletedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { markAttendance, getAllAttendance, getMyAttendance, deleteAttendance };
