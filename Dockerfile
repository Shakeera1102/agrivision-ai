# -------------------------------------------------------------------
# AgriVision AI - Production Container
# Hybrid (ResNet50 + EfficientNetB0) + PCA (95%) + SVM
# -------------------------------------------------------------------
FROM python:3.11-slim

# Set environment flags
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TF_CPP_MIN_LOG_LEVEL=2 \
    TF_ENABLE_ONEDNN_OPTS=0 \
    PORT=7860

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend files and pre-built frontend distribution
COPY backend/ ./backend/
COPY frontend/dist/ ./frontend/dist/

# Set working directory to backend
WORKDIR /app/backend

# Expose port (default 7860 for Hugging Face Spaces; Render/Railway pass their own $PORT)
EXPOSE 7860

# Start server
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
