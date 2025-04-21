# Start with a slim Python base image
FROM python:3.11-slim

# Set the working directory to /app
WORKDIR /app

# Copy all the necessary files to the container
COPY . .

# If you have any additional system dependencies like ffmpeg, install them here (optional)
# For instance: 
# RUN apt-get update && apt-get install -y ffmpeg

# Entry point for your worker script
CMD ["python", "burn-subtitles.py"]
