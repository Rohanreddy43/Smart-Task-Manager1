#!/bin/bash

# Smart Task Manager Deployment Script

set -e

echo "🚀 Starting Smart Task Manager deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build and start services
print_status "Building and starting services..."
cd docker
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "✅ Services are running successfully!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:8080"
    echo "   Swagger UI: http://localhost:8080/swagger-ui.html"
    echo ""
    echo "🗄️  Database:"
    echo "   Host: localhost:5432"
    echo "   Database: smart_task_manager"
    echo "   Username: postgres"
    echo "   Password: password"
    echo ""
    print_status "Deployment completed successfully!"
else
    print_error "Services failed to start properly. Please check the logs."
    docker-compose logs
    exit 1
fi

# Optional: Run health checks
print_status "Running health checks..."
sleep 10

# Check backend health
if curl -f http://localhost:8080/actuator/health &> /dev/null; then
    print_status "✅ Backend health check passed"
else
    print_warning "⚠️  Backend health check failed"
fi

# Check frontend health
if curl -f http://localhost:3000/health &> /dev/null; then
    print_status "✅ Frontend health check passed"
else
    print_warning "⚠️  Frontend health check failed"
fi

echo ""
print_status "🎉 Smart Task Manager is now running!"
echo ""
echo "💡 Tips:"
echo "   - To view logs: docker-compose logs -f"
echo "   - To stop services: docker-compose down"
echo "   - To rebuild: docker-compose build --no-cache && docker-compose up -d"