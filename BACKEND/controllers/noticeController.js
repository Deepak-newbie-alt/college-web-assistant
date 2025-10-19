const Notice = require("../models/notice");

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ datePosted: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Consider: Only admin or teacher should call this route: protect in route!
exports.createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    const notice = await Notice.create({ title, description });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
