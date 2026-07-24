@echo off
setlocal
cd /d "%~dp0"

echo [1/2] Building Vue frontend...
cd frontend
call npm run build
if errorlevel 1 exit /b 1

echo [2/2] Starting Spring Boot (H2 profile)...
cd ..
call mvn spring-boot:run -Dspring-boot.run.profiles=h2
exit /b %errorlevel%
