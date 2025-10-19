import React, { useContext, useState } from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthContext";
import "./ApplyLeave.css";

const ApplyLeave = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    reason: "",
    fromDate: "",
    toDate: "",
  });
  const [message, setMessage] = useState("");

  if (!user || user.role !== "student") {
    return <p>Access denied. Only students can apply for leaves.</p>;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send only reason, fromDate, toDate; backend uses user info for dept/year/name
      await axios.post("/leave/apply", form);
      setMessage("Leave request submitted!");
      setForm({ reason: "", fromDate: "", toDate: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply for leave. Try again.");
    }
  };

  return (
    <div className="leave-container">
      <h2>Apply for Leave</h2>
      <form onSubmit={handleSubmit} className="leave-form">
        <input name="studentName" value={user.name} readOnly placeholder="Student Name" required />
        <input name="department" value={user.department || ""} readOnly placeholder="Department" required />
        <input name="year" value={user.year || ""} readOnly placeholder="Year" required />
        <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="Reason for leave" required rows={4} />
        <label htmlFor="fromDate">From Date:</label>
        <input name="fromDate" id="fromDate" type="date" value={form.fromDate} onChange={handleChange} required />
        <label htmlFor="toDate">To Date:</label>
        <input name="toDate" id="toDate" type="date" value={form.toDate} onChange={handleChange} required />
        <button type="submit">Apply</button>
      </form>
      {message && <p className="leave-message">{message}</p>}
    </div>
  );
};

export default ApplyLeave;
