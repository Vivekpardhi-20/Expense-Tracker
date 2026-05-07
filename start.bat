@echo off
REM Quick Start Script for Expense Tracker (Windows)

cls
echo.
echo ================================================
echo   Expense Tracker - Quick Start Setup
echo ================================================
echo.

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo X Docker is not installed.
    echo   Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo X Docker Compose is not installed.
    pause
    exit /b 1
)

echo ✓ Docker found
echo.

REM Check if .env file exists
if not exist "backend\.env" (
    echo Creating backend\.env from .env.example
    copy backend\.env.example backend\.env
    echo.
    echo Update backend\.env with your PostgreSQL credentials:
    echo   DATABASE_URL=postgresql://user:password@postgres:5432/expense_tracker
    echo.
)

echo ✓ .env file configured
echo.

REM Start Docker services
echo Starting Docker services...
echo (This may take a few minutes on first run)
echo.

docker-compose up -d

REM Wait for services
echo Waiting for services to be ready...
timeout /t 5 /nobreak

echo.
echo ================================================
echo   Application is Ready!
echo ================================================
echo.
echo Frontend:     http://localhost:3000
echo Backend API:  http://localhost:8000
echo API Docs:     http://localhost:8000/docs
echo Full Stack:   http://localhost
echo.
echo Postgres DB:  localhost:5432
echo             Username: expense_user
echo             Database: expense_tracker
echo.
echo ================================================
echo.
echo To stop the services:
echo   docker-compose down
echo.
echo To view logs:
echo   docker-compose logs -f
echo.
pause
