import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import "./Notice.css";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get("/notices/get_notice");
        setNotices(res.data);
      } catch (error) {
        console.error("Failed to fetch notices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  if (loading) return <p className="loading-text">Loading notices...</p>;

  return (
    <div className="notice-container">
      <h2 className="notice-heading">Notices</h2>
      {notices.length === 0 ? (
        <p className="no-notice-text">No notices found.</p>
      ) : (
        <ul className="notice-list">
          {notices.map((notice) => (
            <li key={notice._id} className="notice-item">
              <h3 className="notice-title">{notice.title}</h3>
              <p className="notice-description">{notice.description}</p>
              <small className="notice-date">
                {new Date(notice.datePosted).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notice;
