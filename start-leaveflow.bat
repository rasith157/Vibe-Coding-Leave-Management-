@echo off
title LeaveFlow - Leave Management System

echo ====================================
echo   LeaveFlow - Leave Management
echo ====================================
echo.

echo What would you like to do?
echo 1. Start Backend only (Micronaut on port 8080)
echo 2. Start Frontend only (Angular on port 4200)
echo 3. Start Both (Recommended for full application)
echo 4. Install Prerequisites Check
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto backend
if "%choice%"=="2" goto frontend
if "%choice%"=="3" goto both
if "%choice%"=="4" goto check
if "%choice%"=="5" goto exit

echo Invalid choice. Please select 1-5.
pause
goto start

:backend
echo.
echo Starting Backend only...
call run-backend.bat
goto end

:frontend
echo.
echo Starting Frontend only...
call run-frontend.bat
goto end

:both
echo.
echo Starting both Backend and Frontend...
echo Opening two command windows...
echo.
start "LeaveFlow Backend" cmd /k run-backend.bat
timeout /t 3 /nobreak
start "LeaveFlow Frontend" cmd /k run-frontend.bat
echo.
echo Both services are starting in separate windows.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:4200
echo.
echo Press any key to close this window...
pause
goto end

:check
echo.
echo Checking Prerequisites...
echo.

echo Checking Java 17...
java -version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Java 17 NOT FOUND
    echo Please install Java 17 from: https://www.oracle.com/java/technologies/downloads/#java17
) else (
    echo ✅ Java is installed
    java -version
)
echo.

echo Checking Maven...
mvn -version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Maven NOT FOUND
    echo Please install Apache Maven from: https://maven.apache.org/download.cgi
) else (
    echo ✅ Maven is installed
    mvn -version
)
echo.

echo Checking Node.js...
node --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js NOT FOUND
    echo Please install Node.js from: https://nodejs.org/
) else (
    echo ✅ Node.js is installed
    node --version
)
echo.

echo Checking npm...
npm --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm NOT FOUND
) else (
    echo ✅ npm is installed
    npm --version
)
echo.

pause
goto start

:exit
echo.
echo Thank you for using LeaveFlow!
exit /b 0

:end
pause

:start
cls
goto start 