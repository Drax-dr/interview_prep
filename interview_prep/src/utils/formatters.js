export const getScoreColor = (score) => {
  if (score >= 90) return "#4caf50";
  if (score >= 70) return "#2196f3";
  if (score >= 50) return "#ff9800";
  return "#f44336";
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};
