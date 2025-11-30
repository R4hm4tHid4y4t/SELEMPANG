@echo off
echo Stopping SelempangKu Application...
docker-compose down
taskkill /F /IM node.exe 2>nul
echo All services stopped!
pause
