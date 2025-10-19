const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

const isTeacher = (req, res, next) => {
  if (req.user?.role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

const isAdminOrTeacher = (req, res, next) => {
  const role = req.user?.role;
  if (role !== "admin" && role !== "teacher") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports = { protect, isAdmin, isTeacher, isAdminOrTeacher };
