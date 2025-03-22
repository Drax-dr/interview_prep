import React, { useRef, useState, useEffect } from "react";
import "./Interview.css";
import {
  CheckCircle,
  Warning,
  Replay,
  PlayArrow,
  Stop,
  NavigateNext,
} from "@mui/icons-material";

function Interview() {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState("00:00");
  const [status, setStatus] = useState("Ready to start your interview");
  const [stream, setStream] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [suggestedResponse, setSuggestedResponse] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [responses, setResponses] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [retakes, setRetakes] = useState({});
  const [currentAttempt, setCurrentAttempt] = useState(null);

  const MAX_RETAKES = 3;

  const interviewQuestions = [
    {
      id: 1,
      question:
        "Tell me about yourself and your background in software development.",
      timeLimit: 180,
    },
    {
      id: 2,
      question:
        "What are your greatest strengths and weaknesses as a developer?",
      timeLimit: 120,
    },
    {
      id: 3,
      question:
        "Describe a challenging project you've worked on and how you handled it.",
      timeLimit: 150,
    },
    {
      id: 4,
      question: "Where do you see yourself in 5 years?",
      timeLimit: 120,
    },
  ];

  useEffect(() => {
    initializeMedia();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const initializeMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setStatus("Error accessing camera/microphone");
    }
  };

  const startRecording = () => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    let startTime = Date.now();
    const chunks = [];
    const currentQuestion = interviewQuestions[currentQuestionIndex];
    setTimeRemaining(currentQuestion.timeLimit);

    const currentQuestionId = currentQuestion.id;
    const attemptNumber = (retakes[currentQuestionId] || 0) + 1;
    setCurrentAttempt(attemptNumber);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      processRecording(blob);
    };

    mediaRecorder.start();
    setIsRecording(true);
    setStatus("Recording in progress...");

    const timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = currentQuestion.timeLimit - elapsed;

      if (remaining <= 0) {
        stopRecording();
        clearInterval(timerInterval);
      } else {
        const minutes = Math.floor(remaining / 60)
          .toString()
          .padStart(2, "0");
        const seconds = (remaining % 60).toString().padStart(2, "0");
        setTimer(`${minutes}:${seconds}`);
        setTimeRemaining(remaining);
      }
    }, 1000);

    mediaRecorderRef.current.timerInterval = timerInterval;
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      clearInterval(mediaRecorderRef.current.timerInterval);
      setIsRecording(false);
      setStatus("Processing recording...");
    }
  };

  const processRecording = (blob) => {
    const url = URL.createObjectURL(blob);
    const currentQuestionId = interviewQuestions[currentQuestionIndex].id;

    const newResponse = {
      questionId: currentQuestionId,
      videoUrl: url,
      transcription: `Sample transcription for attempt ${currentAttempt}...`,
      feedback: `AI-generated feedback for attempt ${currentAttempt}...`,
      attemptNumber: currentAttempt,
      timestamp: new Date().toISOString(),
    };

    // Update responses, keeping all attempts
    setResponses([...responses, newResponse]);
    setTranscribedText(newResponse.transcription);
    setSuggestedResponse(newResponse.feedback);
    setStatus("Recording processed successfully");

    // Update retakes count
    setRetakes((prev) => ({
      ...prev,
      [currentQuestionId]: (prev[currentQuestionId] || 0) + 1,
    }));
  };

  const handleRetake = () => {
    const currentQuestionId = interviewQuestions[currentQuestionIndex].id;
    const currentRetakes = retakes[currentQuestionId] || 0;

    if (currentRetakes >= MAX_RETAKES - 1) {
      setStatus(`Maximum retakes (${MAX_RETAKES}) reached for this question`);
      return;
    }

    // Reset states for new recording
    setTranscribedText("");
    setSuggestedResponse("");
    setTimer("00:00");
    setTimeRemaining(interviewQuestions[currentQuestionIndex].timeLimit);
    setStatus("Ready to retake");
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer("00:00");
      setTranscribedText("");
      setSuggestedResponse("");
      setTimeRemaining(interviewQuestions[currentQuestionIndex + 1].timeLimit);
      setCurrentAttempt(null);
    } else {
      setIsInterviewComplete(true);
    }
  };

  const handleSubmitInterview = () => {
    setShowConfirmation(true);
  };

  const confirmSubmit = () => {
    // Add API call here to submit interview data
    console.log("Submitting responses:", responses);
    setStatus("Interview submitted successfully!");
    setShowConfirmation(false);
  };

  const getRemainingRetakes = () => {
    const currentQuestionId = interviewQuestions[currentQuestionIndex].id;
    const used = retakes[currentQuestionId] || 0;
    return MAX_RETAKES - used;
  };

  return (
    <div className="interview-container">
      <div className="interview-grid">
        <div className="video-section">
          <div className="question-display">
            <h2>
              Question {currentQuestionIndex + 1} of {interviewQuestions.length}
            </h2>
            <p>{interviewQuestions[currentQuestionIndex].question}</p>
            <div className="question-meta">
              <span className="time-limit">
                Time Limit:{" "}
                {Math.floor(
                  interviewQuestions[currentQuestionIndex].timeLimit / 60,
                )}{" "}
                minutes
              </span>
              <span className="retakes-remaining">
                Retakes Remaining: {getRemainingRetakes()}
              </span>
            </div>
          </div>

          <div className="video-container">
            <video ref={videoRef} autoPlay muted />
            <div className="timer">{timer}</div>
            {currentAttempt && (
              <div className="attempt-indicator">Attempt {currentAttempt}</div>
            )}
          </div>

          <div className="controls">
            <button
              className={`control-button start-button ${isRecording ? "disabled" : ""}`}
              onClick={startRecording}
              disabled={isRecording || isInterviewComplete}
            >
              <PlayArrow /> Start
            </button>
            <button
              className={`control-button stop-button ${!isRecording ? "disabled" : ""}`}
              onClick={stopRecording}
              disabled={!isRecording || isInterviewComplete}
            >
              <Stop /> Stop
            </button>
            {!isRecording && transcribedText && (
              <>
                <button
                  className="control-button retake-button"
                  onClick={handleRetake}
                  disabled={getRemainingRetakes() === 0 || isInterviewComplete}
                >
                  <Replay /> Retake
                </button>
                <button
                  className="control-button next-button"
                  onClick={handleNextQuestion}
                  disabled={isInterviewComplete}
                >
                  <NavigateNext /> Next
                </button>
              </>
            )}
          </div>

          <div className="status-indicator">
            <span
              className={`status-text ${status.includes("Error") || status.includes("Maximum") ? "error" : ""}`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="feedback-section">
          <div className="text-box">
            <h3>Your Response</h3>
            <div className="text-content">
              {transcribedText || "Your response will appear here..."}
            </div>
          </div>

          <div className="text-box">
            <h3>AI Feedback</h3>
            <div className="text-content">
              {suggestedResponse || "Feedback will appear here..."}
            </div>
          </div>

          <AttemptHistory
            responses={responses}
            currentQuestionId={interviewQuestions[currentQuestionIndex].id}
          />

          {isInterviewComplete && (
            <button
              className="control-button submit-button"
              onClick={handleSubmitInterview}
            >
              Submit Interview
            </button>
          )}

          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${((currentQuestionIndex + 1) / interviewQuestions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h3>Submit Interview?</h3>
            <p>
              Are you sure you want to submit your interview? This action cannot
              be undone.
            </p>
            <div className="modal-buttons">
              <button onClick={() => setShowConfirmation(false)}>Cancel</button>
              <button onClick={confirmSubmit} className="confirm-button">
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const AttemptHistory = ({ responses, currentQuestionId }) => {
  const questionAttempts = responses.filter(
    (response) => response.questionId === currentQuestionId,
  );

  if (questionAttempts.length === 0) return null;

  return (
    <div className="attempt-history">
      <h4>Previous Attempts</h4>
      <div className="attempt-list">
        {questionAttempts.map((attempt, index) => (
          <div key={index} className="attempt-item">
            <span className="attempt-number">
              Attempt {attempt.attemptNumber}
            </span>
            <span className="attempt-time">
              {new Date(attempt.timestamp).toLocaleTimeString()}
            </span>
            <button className="view-attempt-button">View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interview;
