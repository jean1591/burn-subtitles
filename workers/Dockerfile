# Start with a slim Python base image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Install system dependencies including ffmpeg
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install whisper CLI globally
RUN pip install --no-cache-dir openai-whisper

# Copy all the necessary files to the container
COPY . .

# Entry point for your worker script
CMD ["python", "burn-subtitles.py"]