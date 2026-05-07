@echo off
REM POST-SETUP VERIFICATION SCRIPT (Windows)

cls
echo.
echo ==========================================
echo Expense Tracker - Setup Verification
echo ==========================================
echo.

echo Checking Docker services...
docker-compose ps

echo.
echo Testing Backend API...
curl -s http://localhost:8000/api/health

echo.
echo Frontend Status:
curl -s http://localhost:3000 > nul 2>&1 && (
    echo ✓ Frontend is running
) || (
    echo ✗ Frontend not responding
)

echo.
echo Backend Status:
curl -s http://localhost:8000/api/health > nul 2>&1 && (
    echo ✓ Backend is running
) || (
    echo ✗ Backend not responding
)

echo.
echo ==========================================
echo Access URLs:
echo ==========================================
echo Frontend:     http://localhost:3000
echo Backend API:  http://localhost:8000
echo API Docs:     http://localhost:8000/docs
echo Full Stack:   http://localhost
echo.
echo Database Connection:
echo Host:     localhost
echo Port:     5432
echo Username: expense_user
echo Database: expense_tracker
echo.
echo ==========================================
echo.
pause
