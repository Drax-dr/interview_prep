export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const getMetricColor = (value) => {
  if (value >= 90) return "#4caf50";
  if (value >= 70) return "#2196f3";
  return "#f44336";
};

export const parseAnalysis = (analysisString) => {
  try {
    return JSON.parse(analysisString);
  } catch (error) {
    console.error("Error parsing analysis:", error);
    return {
      confidence_score: 0,
      delivery_quality: 0,
      improvements: "Error parsing feedback",
      overall_impression: "Error parsing feedback",
    };
  }
};
