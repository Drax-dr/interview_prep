from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper
import tempfile
import os
from moviepy.editor import VideoFileClip
import requests
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Constants
WHISPER_MODEL = "base"
OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2:1b"

# Initialize Whisper model
try:
    whisper_model = whisper.load_model(WHISPER_MODEL)
    logger.info("Whisper model loaded successfully")
except Exception as e:
    logger.error(f"Error loading Whisper model: {e}")
    whisper_model = None

def extract_audio_from_video(video_path):
    """Extract audio from video file"""
    try:
        temp_audio = tempfile.NamedTemporaryFile(suffix='.mp3', delete=False)
        with VideoFileClip(video_path) as video:
            video.audio.write_audiofile(temp_audio.name, verbose=False, logger=None)
        return temp_audio.name
    except Exception as e:
        logger.error(f"Error extracting audio: {e}")
        raise

def get_ollama_analysis(text):
    """Get analysis from Ollama API"""
    prompt = f"""
    As an expert interview analyzer, analyze the following interview response.
    Provide detailed feedback in the following areas:

    1. Content Analysis
    2. Delivery Assessment
    3. Language and Clarity
    4. Professional Presentation
    5. Areas for Improvement
    6. Overall Score (0-100)

    Interview Response: {text}

    Return the analysis in the following JSON format:
    {{
        "content_score": <score>,
        "delivery_score": <score>,
        "language_score": <score>,
        "presentation_score": <score>,
        "overall_score": <score>,
        "detailed_feedback": {{
            "strengths": [<list of strengths>],
            "improvements": [<list of improvement areas>],
            "recommendations": [<specific recommendations>]
        }},
        "summary": <brief overall impression>
    }}
    """

    try:
        response = requests.post(OLLAMA_API_URL, json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False
        })

        if response.status_code == 200:
            return response.json()["response"]
        else:
            logger.error(f"Ollama API error: {response.status_code}")
            raise Exception("Failed to get analysis from Ollama")
    except Exception as e:
        logger.error(f"Error in Ollama analysis: {e}")
        raise

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({"status": "healthy", "whisper": whisper_model is not None})

@app.route('/api/analyze-interview', methods=['POST'])
def analyze_interview():
    """Main endpoint for interview analysis"""
    try:
        # Ensure a video file is provided
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400

        video_file = request.files['video']

        if video_file.filename == '':
            return jsonify({'error': 'No selected video file'}), 400

        # Log the incoming file details
        logger.info(f"Received video file: {video_file.filename}")

        # Save the video file temporarily to a known path
        temp_video_path = os.path.join(tempfile.gettempdir(), f"{video_file.filename}")
        video_file.save(temp_video_path)
        logger.info(f"Video file saved at: {temp_video_path}")

        # Extract audio from the video
        audio_path = extract_audio_from_video(temp_video_path)
        logger.info(f"Audio extracted and saved at: {audio_path}")

        # Transcribe the audio using Whisper
        transcription_result = whisper_model.transcribe(audio_path)
        transcribed_text = transcription_result["text"]
        logger.info("Audio transcription completed.")

        # Get analysis from Ollama
        analysis = get_ollama_analysis(transcribed_text)
        logger.info("Ollama analysis completed.")

        # Clean up temporary files
        os.unlink(temp_video_path)
        os.unlink(audio_path)
        logger.info("Temporary files cleaned up.")

        return jsonify({
            'transcription': transcribed_text,
            'analysis': analysis
        })

    except Exception as e:
        logger.error(f"Error in interview analysis: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
