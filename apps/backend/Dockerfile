# apps/backend/Dockerfile

FROM node:20 AS builder

WORKDIR /app

# Install app dependencies including dev dependencies for build
COPY package*.json ./
RUN npm install

# Copy the rest of the app source
COPY . .

# Build the application
RUN npm run build
RUN ls -la dist || echo "dist directory not found"

# Production stage
FROM node:20

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built app from builder stage
COPY --from=builder /app/dist/ ./dist/

# Create empty .env file to ensure it exists
RUN touch .env

# Create uploads directory
RUN mkdir -p uploads

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/src/main.js"]
