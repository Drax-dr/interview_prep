import React from "react";
import "./Dashboard.css";
import {
  Assignment,
  VideoLibrary,
  Timeline,
  TrendingUp,
} from "@mui/icons-material";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Welcome back, User!</h1>
            <p>Here's what's happening with your interview practice</p>
          </div>
          <div className="date-time">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Interviews</span>
            <div className="stat-icon" style={{ background: "#e3f2fd" }}>
              <Assignment style={{ color: "#1976d2" }} />
            </div>
          </div>
          <div className="stat-value">24</div>
          <div className="stat-change">+12% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Practice Hours</span>
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <VideoLibrary style={{ color: "#2e7d32" }} />
            </div>
          </div>
          <div className="stat-value">48</div>
          <div className="stat-change">+8% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Average Score</span>
            <div className="stat-icon" style={{ background: "#ede7f6" }}>
              <Timeline style={{ color: "#5e35b1" }} />
            </div>
          </div>
          <div className="stat-value">85%</div>
          <div className="stat-change">+5% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Performance</span>
            <div className="stat-icon" style={{ background: "#fce4ec" }}>
              <TrendingUp style={{ color: "#c2185b" }} />
            </div>
          </div>
          <div className="stat-value">92%</div>
          <div className="stat-change">+15% from last month</div>
        </div>
      </div>

      <div className="recent-activities">
        <div className="activities-header">
          <h2>Recent Activities</h2>
        </div>
        <div className="activity-list">
          {[1, 2, 3].map((item) => (
            <div key={item} className="activity-item">
              <div className="activity-icon">
                <VideoLibrary />
              </div>
              <div className="activity-content">
                <div className="activity-title">
                  Completed Technical Interview Practice
                </div>
                <div className="activity-time">2 hours ago</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
