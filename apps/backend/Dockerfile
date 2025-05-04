# apps/backend/Dockerfile

FROM node:18-slim AS builder

WORKDIR /app

# Install app dependencies including dev dependencies for build
COPY package*.json ./
RUN npm install

# Copy the rest of the app source
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-slim

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built app from builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
