@echo off
echo Starting SelempangKu Application...
echo.
echo 1. Starting MySQL with Docker Compose...
docker-compose up -d

echo.
echo 2. Starting Backend...
start cmd /k "cd backend && npm start"

echo.
echo 3. Starting Frontend...
start cmd /k "cd frontend && npm start"

echo.
echo ======================================
echo SelempangKu is running!
echo ======================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo phpMyAdmin: http://localhost:8080
echo ======================================
pause
