import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from ocr_handler import process_images_and_generate_audio
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Get OpenAI API key from environment variable
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
if not OPENAI_API_KEY:
    logger.error("OpenAI API key not found in environment variables")
    raise ValueError("OpenAI API key not found in environment variables")

app = Flask(__name__)

# Configure upload settings
UPLOAD_FOLDER = 'static/uploads'
AUDIO_FOLDER = 'static/audio'
TEXT_FOLDER = 'static/text'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['AUDIO_FOLDER'] = AUDIO_FOLDER
app.config['TEXT_FOLDER'] = TEXT_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max-limit

# Create necessary directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(AUDIO_FOLDER, exist_ok=True)
os.makedirs(TEXT_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files provided'}), 400

    files = request.files.getlist('files[]')
    uploaded_files = []

    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            uploaded_files.append(filepath)

    if uploaded_files:
        # Process images and generate audio
        result = process_images_and_generate_audio(
            uploaded_files,
            app.config['AUDIO_FOLDER'],
            app.config['TEXT_FOLDER']
        )
        return jsonify({
            'message': 'Processing complete',
            'audio_files': result['audio_files'],
            'text_file': result['text_file']
        })

    return jsonify({'error': 'No valid files uploaded'}), 400

@app.route('/audio/<filename>')
def serve_audio(filename):
    return send_from_directory(app.config['AUDIO_FOLDER'], filename)

@app.route('/text/<filename>')
def serve_text(filename):
    return send_from_directory(app.config['TEXT_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)