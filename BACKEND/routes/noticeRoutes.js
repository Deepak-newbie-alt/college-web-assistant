const express = require("express");
const router = express.Router();
const { getNotices, createNotice } = require("../controllers/noticeController");
const { protect, isAdminOrTeacher } = require("../middleware/authMiddleware");

router.get("/get_notice", getNotices);
router.post("/create_notice", protect, isAdminOrTeacher, createNotice);  // <--- Secured Create Notice!

module.exports = router;
