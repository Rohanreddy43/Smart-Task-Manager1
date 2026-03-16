#!/bin/bash

# Smart Task Manager Setup Script

set -e

echo "🔧 Setting up Smart Task Manager development environment..."

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

# Check if Java is installed
if ! command -v java &> /dev/null; then
    print_error "Java is not installed. Please install Java 17 or higher first."
    exit 1
fi

# Check Java version
JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | sed '/^1\./s///' | cut -d'.' -f1)
if [ "$JAVA_VERSION" -lt 17 ]; then
    print_error "Java version 17 or higher is required. Current version: $JAVA_VERSION"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    print_error "Maven is not installed. Please install Maven first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $NODE_VERSION"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "✅ Prerequisites check passed"

# Setup backend
print_status "Setting up backend..."
cd backend

# Build backend
print_status "Building backend..."
mvn clean compile

if [ $? -eq 0 ]; then
    print_status "✅ Backend build successful"
else
    print_error "Backend build failed"
    exit 1
fi

cd ..

# Setup frontend
print_status "Setting up frontend..."
cd frontend

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_status "✅ Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p uploads

# Set up environment files
print_status "Setting up environment files..."

# Backend environment file
if [ ! -f "backend/src/main/resources/application-local.yml" ]; then
    print_status "Creating backend environment file..."
    cat > backend/src/main/resources/application-local.yml << EOF
# Local Development Environment Configuration
spring:
  profiles: local
  
  # H2 Database for Local Development
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  
  # H2 Console
  h2:
    console:
      enabled: true
      path: /h2-console
  
  # JPA Configuration for Local Development
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        format_sql: true
  
  # File Upload Configuration for Local Development
  servlet:
    multipart:
      location: ${java.io.tmpdir}/uploads

# JWT Configuration for Local Development
app:
  jwtSecret: dev-jwt-secret-key-for-local-development-only

# Logging Configuration for Local Development
logging:
  level:
    com.smarttaskmanager: DEBUG
    org.springframework.security: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql.BasicBinder: TRACE
  pattern:
    console: "%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n"
EOF
    print_status "✅ Backend environment file created"
fi

# Frontend environment file
if [ ! -f "frontend/.env.local" ]; then
    print_status "Creating frontend environment file..."
    cat > frontend/.env.local << EOF
# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENV=development
EOF
    print_status "✅ Frontend environment file created"
fi

print_status "✅ Environment setup completed"

echo ""
print_status "🎉 Smart Task Manager development environment setup complete!"
echo ""
echo "💡 Next steps:"
echo "   1. Start the backend: cd backend && mvn spring-boot:run"
echo "   2. Start the frontend: cd frontend && npm run dev"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Additional commands:"
echo "   - Run tests: mvn test (backend) / npm test (frontend)"
echo "   - Build production: mvn clean package (backend) / npm run build (frontend)"
echo "   - Docker deployment: ./scripts/deploy.sh"