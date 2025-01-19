# MonReader: OCR and Text-to-Speech for Document Digitization
![MonReader Application Screenshot](assets/MonREaderApp.png)
MonReader is an innovative mobile document digitization solution designed for the blind, researchers, and anyone in need of fast, high-quality, and fully automated document scanning. This project leverages Artificial Intelligence, Computer Vision, and advanced deployment techniques to simplify the process of document scanning, text recognition, and text-to-speech conversion.

## Features

- **Automatic Page Flip Detection**: Detects page flips using a low-resolution camera preview.
- **High-Resolution Scanning**: Captures high-resolution images of documents.
- **Document Processing**:
  - Recognizes document corners and crops accordingly.
  - Dewarps the cropped document to a bird's eye view.
  - Enhances text contrast for better readability.
- **Text Recognition**:
  - **PaddleOCR**: Used for extracting text from images with high accuracy.
  - Preserves formatting and applies machine learning-powered corrections.
- **Text-to-Speech Integration**: Converts recognized text into speech for accessibility.
- **Text Generation from Audio**: OpenAI's API is used to generate text from audio for enhanced accessibility.
- **User-Friendly Interface**: Developed using Flask, the UI provides a simple drag-and-drop functionality for uploading images and generating audio.

## Project Goals

1. Predict if a page is being flipped using a single image.
2. Evaluate model performance using the F1 score (higher is better).
3. Provide a seamless and accessible document digitization experience.

## Technologies Used

- **Image Classification**: EfficientNet with TensorFlow for accurate and efficient image classification.
- **Text Recognition**: PaddleOCR for extracting text from images.
- **UI Development**: Flask for building the user interface.
- **Text Generation**: OpenAI's API for generating text from audio.
- **Deployment**:
  - Docker for containerization.
  - Terraform for provisioning AWS ECR (Elastic Container Registry) and ECS (Elastic Container Service).
- **CI/CD**: GitHub Actions for continuous integration and deployment.
- **Frontend**: User-friendly interface for processing images and generating audio.

## Data Description

The dataset consists of page-flipping videos captured using smartphones. These videos are labeled as "flipping" or "not flipping." The videos are clipped into short segments, and frames are extracted and saved sequentially with the naming structure: `VideoID_FrameNumber`.

### Dataset Download
[Download the dataset here](https://drive.google.com/file/d/1KDQBTbo5deKGCdVV_xIujscn5ImxW4dm/view?usp=sharing)

## Repository Structure
reader-ocr-text-to-speech/
├── .github/workflows/ # GitHub Actions workflows
├── app/ # Application source code
├── monreader_notebook.ipynb # Jupyter Notebook for model training and evaluation
├── requirements.txt # Python dependencies
├── Dockerfile # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── README.md # Project documentation


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bellapp/reader-ocr-text-to-speech.git
   cd reader-ocr-text-to-speech
2. Install dependencies:
    ```bash
    pip install -r requirements.txt
3. Run the application:
    ```bash
    python app/main.py
## Usage
1. Upload a video or image sequence of a document being flipped.
2. The system will detect page flips, process the document, and extract text using PaddleOCR.
3. Use the text-to-speech feature to listen to the extracted text.
4. Generate text from audio using OpenAI's API for further processing.
   
## Model Training
The monreader_notebook.ipynb file contains the code for training and evaluating the page-flip detection model. The model is trained on the provided dataset and optimized for F1 score.

## Deployment
- Docker: The application is containerized using Docker for easy deployment.
- AWS Provisioning: Terraform is used to provision AWS ECR and ECS for hosting the application.
- CI/CD: GitHub Actions automate the build, test, and deployment process.


## Contact
For questions or support, please open an issue in this repository.

Connect with me on [LinkedIn](https://www.linkedin.com/in/bellout/)
