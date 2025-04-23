# Start with a slim Python base image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the necessary files to the container
COPY . .

# Entry point for your worker script
CMD ["python", "burn-subtitles.py"]