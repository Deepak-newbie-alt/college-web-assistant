const mongoose = require("mongoose");

const daysEnum = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const scheduleSchema = new mongoose.Schema({
  department: { type: String, required: true },
  year: { type: String, required: true },
  timetable: [
    {
      day: { type: String, required: true, enum: daysEnum },
      lectures: [{ subject: String, time: String }]
    }
  ]
});

module.exports = mongoose.model("Schedule", scheduleSchema);
