import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PerformanceMetrics from "../components/PerformanceMetrics";
import "./Results.css";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { responses } = location.state || { responses: [] };

  if (!responses.length) {
    navigate("/interview");
    return null;
  }

  const calculateAverageScores = () => {
    return responses.reduce(
      (acc, response) => {
        const analysis = JSON.parse(response.analysis);
        return {
          confidence: acc.confidence + parseInt(analysis.confidence_score),
          dialogueDelivery:
            acc.dialogueDelivery + parseInt(analysis.delivery_quality),
          accuracy: acc.accuracy + parseInt(analysis.accuracy || 90),
        };
      },
      { confidence: 0, dialogueDelivery: 0, accuracy: 0 },
    );
  };

  const averageScores = calculateAverageScores();
  const questionCount = responses.length;

  const finalScores = {
    confidence: Math.round(averageScores.confidence / questionCount),
    dialogueDelivery: Math.round(
      averageScores.dialogueDelivery / questionCount,
    ),
    accuracy: Math.round(averageScores.accuracy / questionCount),
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Interview Analysis Results</h1>
        <p>Your performance analysis based on {questionCount} questions</p>
      </div>

      <div className="overall-metrics">
        <PerformanceMetrics {...finalScores} />
      </div>

      <div className="detailed-responses">
        {responses.map((response, index) => (
          <div key={index} className="response-card">
            <div className="response-header">
              <h3>Question {index + 1}</h3>
              <span className="timestamp">
                {new Date(response.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="response-content">
              <div className="transcription-section">
                <h4>Your Response:</h4>
                <p>{response.transcription}</p>
              </div>

              <div className="feedback-section">
                <h4>AI Feedback:</h4>
                <div className="feedback-content">
                  {Object.entries(JSON.parse(response.analysis)).map(
                    ([key, value], i) => (
                      <div key={i} className="feedback-item">
                        <strong>{key.replace("_", " ")}:</strong>
                        <p>{value}</p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate("/interview")} className="retry-button">
          Start New Interview
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="dashboard-button"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Results;
