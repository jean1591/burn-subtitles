# Step 1: Build the React app
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
ARG VITE_APP_API_URL
RUN npm run build

# Step 2: Serve with a lightweight server that can handle env vars
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]