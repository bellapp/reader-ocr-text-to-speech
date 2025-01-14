# Use Python 3.9 slim image
# FROM python:3.9-slim
# FROM python:3.10-slim-bullseye
FROM paddlepaddle/paddle:3.0.0b1
# FROM paddlecloud/paddleocr:2.6-cpu-013870
# FROM harshan1996/paddleocr:stable

# Set working directory
WORKDIR /app

# Install system dependencies
# RUN apt-get update && apt-get install -y \
#     libglib2.0-0 \
#     libsm6 \
#     libxext6 \
#     libxrender-dev \
#     libgl1-mesa-glx \
#     libgomp1 \
#     libssl1.1 \
#     && rm -rf /var/lib/apt/lists/*
# RUN apt-get update && apt-get install -y \
#     libglib2.0-0 \
#     libsm6 \
#     libxext6 \
#     libxrender-dev \
#     libgl1-mesa-glx \
#     libgomp1 \
#     libssl3 \
#     && ln -s /usr/lib/x86_64-linux-gnu/libssl.so.3 /usr/lib/x86_64-linux-gnu/libssl.so.1.1 \
#     && ln -s /usr/lib/x86_64-linux-gnu/libcrypto.so.3 /usr/lib/x86_64-linux-gnu/libcrypto.so.1.1 \
#     && rm -rf /var/lib/apt/lists/*
# Install system dependencies
# Install system dependencies
# RUN apt-get update && apt-get install -y \
#     libglib2.0-0 \
#     libsm6 \
#     libxext6 \
#     libxrender-dev \
#     libgl1-mesa-glx \
#     libgomp1 \
#     libssl1.1 \
#     && rm -rf /var/lib/apt/lists/*


# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Upgrade setuptools to avoid warnings
RUN pip install --upgrade setuptools

# Copy application code
COPY app/ .

# Create necessary directories
RUN mkdir -p static/uploads static/audio static/text

# Pre-download PaddleOCR models
RUN mkdir -p /root/.paddleocr/whl/det/en/en_PP-OCRv3_det_infer/ && \
    wget https://paddleocr.bj.bcebos.com/PP-OCRv3/english/en_PP-OCRv3_det_infer.tar -P /root/.paddleocr/whl/det/en/en_PP-OCRv3_det_infer/ && \
    mkdir -p /root/.paddleocr/whl/rec/en/en_PP-OCRv3_rec_infer/ && \
    wget https://paddleocr.bj.bcebos.com/PP-OCRv3/english/en_PP-OCRv3_rec_infer.tar -P /root/.paddleocr/whl/rec/en/en_PP-OCRv3_rec_infer/ && \
    mkdir -p /root/.paddleocr/whl/cls/ch_ppocr_mobile_v2.0_cls_infer/ && \
    wget https://paddleocr.bj.bcebos.com/dygraph_v2.0/ch/ch_ppocr_mobile_v2.0_cls_infer.tar -P /root/.paddleocr/whl/cls/ch_ppocr_mobile_v2.0_cls_infer/
# Set environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV CUDA_VISIBLE_DEVICES=-1
# Expose port
EXPOSE 5000

# Run the application
# CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
# CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "120", "app:app"]
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "300", "--workers", "1", "--threads", "4", "app:app"]