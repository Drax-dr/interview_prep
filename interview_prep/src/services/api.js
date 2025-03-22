const API_URL = "http://localhost:5000/api";

export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await response.json();
  } catch (error) {
    console.error("API health check failed:", error);
    throw error;
  }
};

export const analyzeInterview = async (videoBlob) => {
  const formData = new FormData();
  formData.append("video", videoBlob, "interview.webm");

  try {
    const response = await fetch(`${API_URL}/analyze-interview`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Analysis failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing interview:", error);
    throw error;
  }
};
