const Schedule = require("../models/schedule");

const getSchedule = async (req, res) => {
  const { department, year } = req.params;
  try {
    const schedule = await Schedule.findOne({ department, year });
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateSchedule = async (req, res) => {
  const { department, year } = req.params;
  const updates = req.body;
  try {
    const updatedSchedule = await Schedule.findOneAndUpdate({ department, year }, { $set: updates }, { new: true });
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const createSchedule = async (req, res) => {
  try {
    const schedules = Array.isArray(req.body) ? req.body : [req.body];
    for (const schedule of schedules) {
      const { department, year } = schedule;
      const exists = await Schedule.findOne({ department, year });
      if (exists) {
        return res.status(400).json({ message: `Schedule for ${department} year ${year} already exists` });
      }
    }
    const insertedSchedule = await Schedule.insertMany(schedules);
    return res.status(201).json({ message: "Schedule created successfully", data: insertedSchedule });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteSchedule=async (req,res)=>{
  const {department,year}=req.params;
  try{
    const deleted=await Schedule.findOneAndDelete({department,year});
    if(!deleted){
      req.status(404).json({message:"Schedule not found"});
    }
    res.status(200).json({message:`Schedule for ${department} ${year} year deleted successfully`});
  }catch(error){
    return res.status(500).json({message:"Server Error",error:error.message});
  }
};

module.exports = { getSchedule, updateSchedule, createSchedule,deleteSchedule };
