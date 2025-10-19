import React, { useContext, useState } from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthContext";
import "./CreateNotice.css";

const CreateNotice = () => {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title: "", description: "" });
  const [message, setMessage] = useState("");

  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    return <p className="access-denied">Access denied. Only admin/teacher can create notices.</p>;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/notices/create_notice", form);
      setMessage("Notice created successfully");
      setForm({ title: "", description: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create notice");
    }
  };

  return (
    <div className="notice-form-container">
      <h2>Create Notice</h2>
      <form onSubmit={handleSubmit} className="notice-form">
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required rows={5} />
        <button type="submit">Create</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default CreateNotice;
