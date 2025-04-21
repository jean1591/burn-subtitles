# apps/backend/Dockerfile

FROM node:18-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app source
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
