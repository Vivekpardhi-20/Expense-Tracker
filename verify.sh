#!/bin/bash
# POST-SETUP VERIFICATION SCRIPT

echo "=========================================="
echo "Expense Tracker - Setup Verification"
echo "=========================================="
echo ""

# Check Docker services
echo "Checking Docker services..."
docker-compose ps

echo ""
echo "Testing Backend API..."
curl -s http://localhost:8000/api/health | json_pp 2>/dev/null || curl -s http://localhost:8000/api/health

echo ""
echo "Frontend Status:"
curl -s http://localhost:3000 > /dev/null && echo "✓ Frontend is running" || echo "✗ Frontend not responding"

echo ""
echo "Backend Status:"
curl -s http://localhost:8000/api/health > /dev/null && echo "✓ Backend is running" || echo "✗ Backend not responding"

echo ""
echo "Database Status:"
docker-compose exec -T postgres pg_isready -U expense_user > /dev/null 2>&1 && echo "✓ Database is running" || echo "✗ Database not responding"

echo ""
echo "=========================================="
echo "Access URLs:"
echo "=========================================="
echo "Frontend:     http://localhost:3000"
echo "Backend API:  http://localhost:8000"
echo "API Docs:     http://localhost:8000/docs"
echo "Full Stack:   http://localhost"
echo ""
echo "Database Connection:"
echo "Host:     localhost"
echo "Port:     5432"
echo "Username: expense_user"
echo "Database: expense_tracker"
echo ""
echo "=========================================="
