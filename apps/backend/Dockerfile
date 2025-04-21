# apps/backend/Dockerfile

# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY apps/backend/package*.json ./
RUN npm install

# Copy app source
COPY . .

# Build the NestJS app
RUN npm run build

# Expose port (if needed, usually 3000)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main"]
