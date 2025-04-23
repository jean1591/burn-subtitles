# apps/backend/Dockerfile

FROM node:18-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install Python3, pip, ffmpeg, and git (for whisper)
RUN apk add --no-cache python3 py3-pip ffmpeg git

# Create and activate a virtual environment
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# Now install whisper in the venv
RUN pip install git+https://github.com/openai/whisper.git

# Copy the rest of the app source
COPY . .

RUN npm run build

# Copy the burn-subtitles.py script from the local workers directory
COPY ./workers/burn-subtitles.py ./workers/burn-subtitles.py

EXPOSE 3000

CMD ["node", "dist/main"]
