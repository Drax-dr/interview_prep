import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="content">
        <h1>Master Your Interview Skills</h1>
        <p>
          Elevate your interview performance with our AI-powered platform. Get
          real-time feedback, practice with custom scenarios, and track your
          progress with advanced analytics.
        </p>

        <div className="buttons-container">
          <Link to="/interview" className="start-button">
            Start Practice Now
          </Link>
          <Link to="/about" className="learn-more-button">
            Learn More
          </Link>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>AI Feedback</h3>
            <p>Get instant, personalized feedback on your responses</p>
          </div>
          <div className="feature-card">
            <h3>Custom Scenarios</h3>
            <p>Practice with industry-specific interview questions</p>
          </div>
          <div className="feature-card">
            <h3>Progress Tracking</h3>
            <p>Monitor your improvement with detailed analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
