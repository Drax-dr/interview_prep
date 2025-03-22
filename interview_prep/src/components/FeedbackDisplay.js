import React from "react";
import "./FeedbackDisplay.css";
import { CircularProgress, Paper, Typography } from "@mui/material";

const FeedbackDisplay = ({ transcription, analysis, status }) => {
  const renderAnalysis = () => {
    if (!analysis || analysis.error) {
      return (
        <div className="error-message">
          {analysis?.error || "No analysis available"}
        </div>
      );
    }

    return (
      <div className="analysis-content">
        <div className="scores-grid">
          {Object.entries(analysis)
            .filter(([key]) => key.includes("score"))
            .map(([key, value]) => (
              <div key={key} className="score-item">
                <Typography variant="h6">
                  {key.replace("_", " ").toUpperCase()}
                </Typography>
                <CircularProgress
                  variant="determinate"
                  value={value}
                  size={60}
                  thickness={4}
                  style={{ color: getScoreColor(value) }}
                />
                <Typography variant="body2">{value}/100</Typography>
              </div>
            ))}
        </div>

        <div className="detailed-feedback">
          {analysis.detailed_feedback && (
            <>
              <FeedbackSection
                title="Strengths"
                items={analysis.detailed_feedback.strengths}
              />
              <FeedbackSection
                title="Areas for Improvement"
                items={analysis.detailed_feedback.improvements}
              />
              <FeedbackSection
                title="Recommendations"
                items={analysis.detailed_feedback.recommendations}
              />
            </>
          )}
        </div>

        {analysis.summary && (
          <Paper elevation={1} className="summary-section">
            <Typography variant="h6">Overall Summary</Typography>
            <Typography variant="body1">{analysis.summary}</Typography>
          </Paper>
        )}
      </div>
    );
  };

  return (
    <div className="feedback-container">
      <div className="transcription-section">
        <Typography variant="h5">Your Response</Typography>
        <Paper elevation={1} className="transcription-content">
          {transcription || "Your response will appear here..."}
        </Paper>
      </div>

      <div className="analysis-section">
        <Typography variant="h5">AI Analysis</Typography>
        {status.includes("Analyzing") ? (
          <div className="loading-state">
            <CircularProgress />
            <Typography>{status}</Typography>
          </div>
        ) : (
          renderAnalysis()
        )}
      </div>
    </div>
  );
};

export default FeedbackDisplay;
