import React from "react";
import { CircularProgress } from "@mui/material";
import "./PerformanceMetrics.css";

const PerformanceMetrics = ({ confidence, dialogueDelivery, accuracy }) => {
  const getColor = (value) => {
    if (value >= 90) return "#4caf50";
    if (value >= 70) return "#2196f3";
    return "#f44336";
  };

  return (
    <div className="metrics-container">
      <div className="metric">
        <CircularProgress
          variant="determinate"
          value={confidence}
          size={80}
          thickness={4}
          style={{ color: getColor(confidence) }}
        />
        <div className="metric-label">
          <span>Confidence</span>
          <span className="metric-value">{confidence}%</span>
        </div>
      </div>

      <div className="metric">
        <CircularProgress
          variant="determinate"
          value={dialogueDelivery}
          size={80}
          thickness={4}
          style={{ color: getColor(dialogueDelivery) }}
        />
        <div className="metric-label">
          <span>Delivery</span>
          <span className="metric-value">{dialogueDelivery}%</span>
        </div>
      </div>

      <div className="metric">
        <CircularProgress
          variant="determinate"
          value={accuracy}
          size={80}
          thickness={4}
          style={{ color: getColor(accuracy) }}
        />
        <div className="metric-label">
          <span>Accuracy</span>
          <span className="metric-value">{accuracy}%</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
