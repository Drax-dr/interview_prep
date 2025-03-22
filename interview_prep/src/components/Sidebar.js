import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import UploadIcon from "@mui/icons-material/Upload";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>AI Interview</h2>
        <p>Practice & Improve</p>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
        >
          <HomeIcon />
          <span>Home</span>
        </Link>

        <Link
          to="/interview"
          className={`nav-item ${location.pathname === "/interview" ? "active" : ""}`}
        >
          <VideoCallIcon />
          <span>New Interview</span>
        </Link>

        <Link
          to="/my-uploads"
          className={`nav-item ${location.pathname === "/my-uploads" ? "active" : ""}`}
        >
          <UploadIcon />
          <span>My Uploads</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <p>© 2024 AI Interview</p>
      </div>
    </div>
  );
};

export default Sidebar;
