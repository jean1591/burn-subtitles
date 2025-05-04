#!/bin/bash

echo "Stopping containers..."
docker-compose down

echo "Rebuilding backend..."
docker-compose build backend

echo "Rebuilding frontend..."
docker-compose build frontend

echo "Starting services..."
docker-compose up -d

echo "Deployment complete!"
echo "Check logs with: docker-compose logs -f [service]" 