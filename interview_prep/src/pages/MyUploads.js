import React from "react";
import "./MyUploads.css";
import PerformanceMetrics from "../components/PerformanceMetrics";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GetAppIcon from "@mui/icons-material/GetApp";
import DeleteIcon from "@mui/icons-material/Delete";

const MyUploads = () => {
  const uploads = [
    {
      id: 1,
      title: "Software Developer Interview Practice",
      date: "2024-01-15",
      duration: "15:30",
      metrics: {
        dialogueDelivery: 85,
        accuracy: 92,
        confidence: 78,
      },
    },
    // Add more uploads as needed
  ];

  return (
    <div className="uploads-container">
      <div className="uploads-header">
        <h1>My Interview Recordings</h1>
        <p>Review and analyze your interview performances</p>
      </div>

      <div className="uploads-grid">
        {uploads.map((upload) => (
          <div key={upload.id} className="upload-card">
            <div className="upload-header">
              <h3 className="upload-title">{upload.title}</h3>
              <div className="upload-meta">
                <span>{upload.date}</span>
                <span>{upload.duration}</span>
              </div>
            </div>

            <div className="upload-content">
              <div className="metrics-section">
                <PerformanceMetrics {...upload.metrics} />
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-button play-button">
                <PlayArrowIcon /> Play
              </button>
              <button className="action-button download-button">
                <GetAppIcon /> Download
              </button>
              <button className="action-button delete-button">
                <DeleteIcon /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyUploads;
