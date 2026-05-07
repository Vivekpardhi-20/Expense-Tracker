#!/bin/bash
# Quick Start Script for Expense Tracker

set -e

echo "================================================"
echo "  Expense Tracker - Quick Start Setup"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    echo "Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed."
    exit 1
fi

print_status "Docker found"

# Check if .env file exists in backend
if [ ! -f "backend/.env" ]; then
    print_warning "Creating backend/.env from .env.example"
    cp backend/.env.example backend/.env
    echo ""
    echo "Update backend/.env with your PostgreSQL credentials:"
    echo "  DATABASE_URL=postgresql://user:password@postgres:5432/expense_tracker"
    echo ""
fi

print_status ".env file configured"

# Start Docker services
echo ""
print_warning "Starting Docker services (this may take a few minutes on first run)..."
echo ""

docker-compose up -d

# Wait for services to be ready
echo ""
print_warning "Waiting for services to be ready..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "Services started successfully!"
    echo ""
    echo "================================================"
    echo "  Application is Ready!"
    echo "================================================"
    echo ""
    echo "Frontend:     http://localhost:3000"
    echo "Backend API:  http://localhost:8000"
    echo "API Docs:     http://localhost:8000/docs"
    echo "Full Stack:   http://localhost"
    echo ""
    echo "Postgres DB:  localhost:5432"
    echo "             Username: expense_user"
    echo "             Database: expense_tracker"
    echo ""
    echo "================================================"
    echo ""
    echo "To stop the services:"
    echo "  docker-compose down"
    echo ""
    echo "To view logs:"
    echo "  docker-compose logs -f"
    echo ""
else
    print_error "Services failed to start. Check logs with: docker-compose logs"
    exit 1
fi
