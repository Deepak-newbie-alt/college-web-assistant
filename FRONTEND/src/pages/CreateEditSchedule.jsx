import React, { useState, useContext } from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthContext";
import "./CreateEditSchedule.css";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const CreateEditSchedule = () => {
  const { user } = useContext(AuthContext);
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [timetable, setTimetable] = useState(daysOfWeek.map(day => ({ day, lectures: [] })));
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [message, setMessage] = useState("");

  if (!user || user.role !== "admin") return <p>Only admin can create timetable.</p>;

  const addLecture = () => {
    if (!subject.trim() || !time.trim()) {
      setMessage("Please enter both subject and time.");
      return;
    }
    setTimetable(prev =>
      prev.map(d =>
        d.day.toLowerCase() === selectedDay.toLowerCase()
          ? { ...d, lectures: [...d.lectures, { subject: subject.trim(), time: time.trim() }] }
          : d
      )
    );
    setSubject("");
    setTime("");
    setMessage("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!department || !year) {
      setMessage("Please fill department and year");
      return;
    }
    try {
      await axios.post("/schedule/create_schedule", {
        department,
        year,
        timetable: timetable.filter(d => d.lectures.length > 0),
      });
      setMessage("Schedule created!");
      setDepartment("");
      setYear("");
      setTimetable(daysOfWeek.map(day => ({ day, lectures: [] })));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create schedule.");
    }
  };

  return (
    <div className="create-edit-schedule">
      <h2>Create Schedule</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} required />
        <input placeholder="Year" value={year} onChange={e => setYear(e.target.value)} required />

        <div className="lecture-form-group">
          <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
            {daysOfWeek.map(day => (<option key={day}>{day}</option>))}
          </select>
          <input placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
          <input placeholder="Time" value={time} onChange={e => setTime(e.target.value)} />
          <button type="button" onClick={addLecture}>Add Lecture</button>
        </div>

        <div className="preview-section">
          <h4>Preview Timetable</h4>
          <ul>
            {timetable.map(day => (
              <li key={day.day}>
                <b>{day.day}:</b> {day.lectures.length > 0 ? day.lectures.map(lec => `${lec.subject} (${lec.time})`).join(", ") : "No lectures"}
              </li>
            ))}
          </ul>
        </div>

        <button type="submit">Create Schedule</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateEditSchedule;
