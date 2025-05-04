# apps/backend/Dockerfile

FROM node:18-slim

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the app source
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
