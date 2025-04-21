# Step 1: Build the React app
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Step 2: Serve the static build with nginx
FROM nginx:alpine

# Copy the React build to the nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a default nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
