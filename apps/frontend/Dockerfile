# Step 1: Build the React app
FROM node:18-slim AS builder

WORKDIR /app
# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the rest of the app source
COPY . .
ARG VITE_APP_API_URL
ENV VITE_APP_API_URL=${VITE_APP_API_URL}
RUN npm run build

# Step 2: Serve with a lightweight server
FROM nginx:alpine

# Copy the built app to nginx serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom nginx config if you need it (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]