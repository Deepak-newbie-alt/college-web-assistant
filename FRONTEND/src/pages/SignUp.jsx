import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    department: "",
    year: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.role === "student" && (!form.department || !form.year)) {
      setMessage("Department and year are required for students");
      return;
    }
    try {
      const res = await axios.post("/users/register", form);
      setMessage(res.data.message || "Registration successful");
      setForm({ name: "", email: "", password: "", role: "student", department: "", year: "" });
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-heading">Create Account</h2>
        <form onSubmit={handleSubmit} className="signup-form" noValidate>
          
          <div className="input-group">
            <input name="name" placeholder=" " value={form.name} onChange={handleChange} required className="signup-input" />
            <label>Name</label>
          </div>
          
          <div className="input-group">
            <input name="email" type="email" placeholder=" " value={form.email} onChange={handleChange} required className="signup-input" />
            <label>Email</label>
          </div>
          
          <div className="input-group">
            <input name="password" type="password" placeholder=" " value={form.password} onChange={handleChange} required className="signup-input" />
            <label>Password</label>
          </div>
          
          <div className="input-group">
            <select name="role" value={form.role} onChange={handleChange} className="signup-select" required>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
            <label className="select-label">Role</label>
          </div>
          
          {form.role === "student" && (
            <>
              <div className="input-group">
                <input name="department" placeholder=" " value={form.department} onChange={handleChange} required className="signup-input" />
                <label>Department</label>
              </div>
              <div className="input-group">
                <input name="year" placeholder=" " value={form.year} onChange={handleChange} required className="signup-input" />
                <label>Year</label>
              </div>
            </>
          )}

          <button type="submit" className="signup-button">Register</button>
        </form>
        {message && <p className="signup-message">{message}</p>}
      </div>
    </div>
  );
};

export default SignUp;
