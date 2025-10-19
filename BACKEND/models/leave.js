const mongoose=require("mongoose");
const leaveSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  status: { type: String, enum: ["Approved", "Rejected", "Pending"], default: "Pending" }
});

leaveSchema.pre(/^find/, function(next) {
  this.populate({ path: "userId", select: "name department year email" });
  next();
});

module.exports = mongoose.model("Leave", leaveSchema);
