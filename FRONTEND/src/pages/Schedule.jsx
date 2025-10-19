import React, { useState } from "react";
import axios from "../api/axios";
import "./Schedule.css";

const Schedule = () => {
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [message, setMessage] = useState("");

  const fetchSchedule = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/schedule/${department}/${year}`);
      setSchedule(res.data);
      setMessage("");
    } catch {
      setSchedule(null);
      setMessage("No schedule found.");
    }
  };

  return (
    <div className="schedule-wrapper">
      <h2 className="schedule-heading">View Timetable</h2>
      <form className="schedule-form" onSubmit={fetchSchedule}>
        <input className="input-field" placeholder="Department" value={department} onChange={e => setDepartment(e.target.value)} required />
        <input className="input-field" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} required />
        <button className="submit-btn" type="submit">Get Timetable</button>
      </form>
      {message && <p className="message-text">{message}</p>}
      {schedule && (
        <div className="timetable-container">
          <h3 className="timetable-title">{schedule.department} - {schedule.year}</h3>
          {schedule.timetable.length === 0 ? (
            <p className="empty-text">No timetable set.</p>
          ) : (
            <table className="timetable-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Lectures</th>
                </tr>
              </thead>
              <tbody>
                {schedule.timetable.map(day => (
                  <tr key={day.day}>
                    <td>{day.day}</td>
                    <td>{day.lectures.map(lec => `${lec.subject} (${lec.time})`).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Schedule;
