import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ message }) => {
  return (
    <div className="spinner-container">
      <CircularProgress />
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
