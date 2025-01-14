import os
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from paddleocr import PaddleOCR
import numpy as np
from openai import OpenAI
from pathlib import Path
import time
import logging

logging.basicConfig(level=logging.DEBUG)
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
class ImageProcessor:
    def __init__(self, model_path, openai_api_key):
        self.model = tf.keras.models.load_model(model_path)
        self.ocr = PaddleOCR(use_gpu=False, use_angle_cls=True, lang='en',
            det_model_dir='/root/.paddleocr/whl/det/en/en_PP-OCRv3_det_infer',
            rec_model_dir='/root/.paddleocr/whl/rec/en/en_PP-OCRv3_rec_infer',
            cls_model_dir='/root/.paddleocr/whl/cls/ch_ppocr_mobile_v2.0_cls_infer')
        self.openai_client = OpenAI(api_key=openai_api_key)

    def preprocess_image(self, img_path, target_size=(224, 224)):
        img = image.load_img(img_path, target_size=target_size)
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = tf.keras.applications.mobilenet.preprocess_input(img_array)
        return img_array

    def split_text(self, text, max_length=4000):
        """Split text into chunks respecting sentence boundaries"""
        sentences = text.split('.')
        chunks = []
        current_chunk = ""

        for sentence in sentences:
            if len(current_chunk) + len(sentence) < max_length:
                current_chunk += sentence + "."
            else:
                if current_chunk:
                    chunks.append(current_chunk.strip())
                current_chunk = sentence + "."

        if current_chunk:
            chunks.append(current_chunk.strip())

        return chunks

    def process_images_and_generate_audio(self, image_paths, audio_folder, text_folder):
        logging.debug("Starting image processing...")
        extracted_text = ""
        audio_files = []
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        text_file_path = os.path.join(text_folder, f"extracted_text_{timestamp}.txt")

        # Process images and extract text
        for img_path in image_paths:
            logging.debug(f"Processing image: {img_path}")
            try:
                # Classify image
                img_array = self.preprocess_image(img_path)
                prediction = self.model.predict(img_array)
                class_label = "flip" if prediction[0][0] > 0.5 else "notflip"

                if class_label == "notflip":
                    # Perform OCR
                    result = self.ocr.ocr(img_path, cls=True)
                    if result[0]:  # Check if OCR found any text
                        for line in result[0]:
                            extracted_text += f"{line[1][0]}\n"
            except Exception as e:
                print(f"Error processing {img_path}: {str(e)}")
        logging.debug("Image processing complete.")
        # Save extracted text to file
        if extracted_text:
            with open(text_file_path, 'w', encoding='utf-8') as f:
                f.write(extracted_text)
            logging.debug("Write extracted text.")
            # Split text into chunks and generate audio
            text_chunks = self.split_text(extracted_text)

            for i, chunk in enumerate(text_chunks):
                try:
                    if chunk.strip():  # Only process non-empty chunks
                        audio_file = os.path.join(audio_folder, f"output_{timestamp}_chunk_{i+1}.mp3")
                        logging.debug("======== Strat text to speech=======.")
                        response = self.openai_client.audio.speech.create(
                            model="tts-1",
                            voice="alloy",
                            input=chunk
                        )
                        response.stream_to_file(audio_file)
                        audio_files.append(os.path.basename(audio_file))
                        # Add a small delay between API calls
                        time.sleep(1)
                        logging.debug("======== Complete text to speech=======.")
                except Exception as e:
                    print(f"Error generating audio for chunk {i+1}: {str(e)}")

        return {
            'audio_files': audio_files,
            'text_file': os.path.basename(text_file_path) if extracted_text else None
        }

def process_images_and_generate_audio(image_paths, audio_folder, text_folder):
    processor = ImageProcessor(
        model_path="mobilenet_fine_tuned_last_10_layers.keras",
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )
    return processor.process_images_and_generate_audio(image_paths, audio_folder, text_folder)