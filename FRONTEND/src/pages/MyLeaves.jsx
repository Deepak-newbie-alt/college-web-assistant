import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "../api/axios";
import "./MyLeave.css"; // optional CSS file

const MyLeaves = () => {
  const { token, user } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchMyLeaves = async () => {
      try {
        const res = await axios.get("/leave/my_leaves", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaves(res.data);
      } catch (error) {
        console.error("Failed to fetch leaves:", error);
        setErrorMsg(error.response?.data?.message || "Failed to load leaves");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMyLeaves();
    }
  }, [token]);

  if (!user) {
    return <p className="access-denied">Please login to view your leaves.</p>;
  }

  return (
    <div className="my-leaves-container">
      <h2>My Leave Requests</h2>

      {loading && <p>Loading your leaves...</p>}
      {errorMsg && <p className="error">{errorMsg}</p>}
      {!loading && leaves.length === 0 && <p>No leaves found.</p>}

      <div className="leave-list">
        {leaves.map((leave) => (
          <div key={leave._id} className="leave-card">
            <p><strong>Reason:</strong> {leave.reason}</p>
            <p>
              <strong>From:</strong> {new Date(leave.fromDate).toLocaleDateString()}
              {" "}to{" "}
              <strong>To:</strong> {new Date(leave.toDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status ${leave.status.toLowerCase()}`}>
                {leave.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLeaves;
