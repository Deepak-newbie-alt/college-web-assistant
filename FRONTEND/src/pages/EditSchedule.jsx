import React, { useState, useContext } from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthContext";
import "./EditSchedule.css";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const EditSchedule = () => {
  const { user } = useContext(AuthContext);

  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [timetable, setTimetable] = useState(daysOfWeek.map(day => ({ day, lectures: [] })));
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "admin") {
    return <p>Access denied. Only admin can edit schedule.</p>;
  }

  const fetchSchedule = async (e) => {
    e.preventDefault();
    if (!department || !year) {
      setMessage("Please enter both department and year");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get(`/schedule/${department}/${year}`);
      if (res.data && res.data.timetable)
        setTimetable(res.data.timetable);
      else
        setTimetable(daysOfWeek.map(day => ({ day, lectures: [] })));
    } catch (error) {
      setMessage(error.response?.data?.message || "Schedule not found");
      setTimetable(daysOfWeek.map(day => ({ day, lectures: [] })));
    } finally {
      setLoading(false);
    }
  };

  const addLecture = () => {
    if (!subject.trim() || !time.trim()) {
      setMessage("Please provide both subject and time");
      return;
    }
    setTimetable(prevTimetable =>
      prevTimetable.map(day =>
        day.day.toLowerCase() === selectedDay.toLowerCase()
          ? { ...day, lectures: [...day.lectures, { subject: subject.trim(), time: time.trim() }] }
          : day
      )
    );
    setSubject("");
    setTime("");
    setMessage("");
  };

  const removeLecture = (dayName, index) => {
    setTimetable(prevTimetable =>
      prevTimetable.map(day =>
        day.day === dayName
          ? { ...day, lectures: day.lectures.filter((_, i) => i !== index) }
          : day
      )
    );
  };

  const handleUpdate = async () => {
    if (!department || !year) {
      setMessage("Please enter both department and year before submitting");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await axios.put(`/schedule/${department}/${year}`, { timetable });
      setMessage("Schedule updated successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update schedule");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!department || !year) {
      setMessage("Please enter department and year to delete");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete the schedule for ${department} ${year}?`)) {
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      await axios.delete(`/schedule/${department}/${year}`);
      setMessage(`Schedule for ${department} ${year} deleted successfully`);
      setTimetable(daysOfWeek.map(day => ({ day, lectures: [] })));
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to delete schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-schedule-container">
      <h2>Edit Schedule</h2>

      <form onSubmit={fetchSchedule} className="load-schedule-form">
        <input type="text" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} required />
        <input type="text" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Loading..." : "Load Schedule"}</button>
      </form>

      <div className="lecture-inputs">
        <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)}>
          {daysOfWeek.map(day => (<option key={day} value={day}>{day}</option>))}
        </select>
        <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} />
        <input type="text" placeholder="Time (e.g. 9:00 AM)" value={time} onChange={e => setTime(e.target.value)} />
        <button type="button" onClick={addLecture}>Add Lecture</button>
      </div>

      {message && <p className="message">{message}</p>}

      <div className="timetable-preview">
        <h3>Current Timetable</h3>
        {timetable.map(day => (
          <div key={day.day} className="day-block">
            <h4>{day.day}</h4>
            {day.lectures.length === 0 ? <p>No lectures</p> : (
              <ul>
                {day.lectures.map((lec, idx) => (
                  <li key={idx}>
                    {lec.subject} ({lec.time})
                    <button className="remove-btn" onClick={() => removeLecture(day.day, idx)}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="submit-btn" onClick={handleUpdate} disabled={loading}>
          {loading ? 'Saving...' : 'Save Schedule'}
        </button>
        <button className="delete-btn" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete Schedule'}
        </button>
      </div>
    </div>
  );
};

export default EditSchedule;
