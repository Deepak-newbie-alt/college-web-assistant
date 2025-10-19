import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "../api/axios";
import "./LeaveRequest.css";

const LeaveRequests = () => {
  const { token, user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const res = await axios.get("/leave/get_leave_requests", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaves(res.data.leaves || []);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        setMessage(error.response?.data?.message || "Failed to load leave requests");
      } finally {
        setLoading(false);
      }
    };

    if (token && (user?.role === "admin" || user?.role === "teacher")) {
      fetchLeaveRequests();
    }
  }, [token, user]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(
        `/leave/update_status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaves((prev) =>
        prev.map((lr) => (lr._id === id ? { ...lr, status } : lr))
      );
    } catch (error) {
      console.error("Failed to update leave status", error);
      setMessage("Failed to update status");
    }
  };

  if (!user || (user.role !== "admin" && user.role !== "teacher")) {
    return <p className="access-denied">Access denied. Admin/Teacher only.</p>;
  }

  if (loading) return <p>Loading leave requests...</p>;

  return (
    <div className="leave-requests-container">
      <h2>All Leave Requests</h2>
      {message && <p className="message">{message}</p>}
      {leaves.length === 0 && <p>No leave requests found.</p>}

      {leaves.map((lr) => (
        <div key={lr._id} className="leave-card">
          <p><strong>Name:</strong> {lr.userId?.name}</p>
          <p><strong>Department:</strong> {lr.userId?.department}</p>
          <p><strong>Year:</strong> {lr.userId?.year}</p>
          <p><strong>Email:</strong> {lr.userId?.email}</p>
          <p><strong>Reason:</strong> {lr.reason}</p>
          <p>
            <strong>From:</strong> {new Date(lr.fromDate).toLocaleDateString()} — 
            <strong> To:</strong> {new Date(lr.toDate).toLocaleDateString()}
          </p>
          <p><strong>Status:</strong> {lr.status}</p>

          {lr.status === "Pending" && (
            <div className="leave-actions">
              <button
                className="approve-btn"
                onClick={() => handleUpdateStatus(lr._id, "Approved")}
              >
                Approve
              </button>
              <button
                className="reject-btn"
                onClick={() => handleUpdateStatus(lr._id, "Rejected")}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeaveRequests;
