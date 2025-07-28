@echo off
title LeaveFlow - Initial Setup

echo =====================================
echo      LeaveFlow - Initial Setup
echo =====================================
echo.

echo This script will prepare your LeaveFlow environment...
echo.

REM Check Java
echo [1/4] Checking Java 17...
java -version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Java 17 not found!
    echo Please install Java 17 from: https://www.oracle.com/java/technologies/downloads/#java17
    echo Then run this setup again.
    pause
    exit /b 1
) else (
    echo ✅ Java is installed
)
echo.

REM Check Node.js
echo [2/4] Checking Node.js...
node --version 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo Please install Node.js from: https://nodejs.org/
    echo Then run this setup again.
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
)
echo.

REM Install frontend dependencies
echo [3/4] Installing frontend dependencies...
cd frontend
echo Installing Angular dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
) else (
    echo ✅ Frontend dependencies installed
)
cd ..
echo.

REM Build backend
echo [4/4] Building backend...
cd backend
echo Building Micronaut application...
gradlew.bat build
if %errorlevel% neq 0 (
    echo ❌ Failed to build backend
    pause
    exit /b 1
) else (
    echo ✅ Backend built successfully
)
cd ..
echo.

echo =====================================
echo        Setup Complete! ✅
echo =====================================
echo.
echo Your LeaveFlow application is ready to run!
echo.
echo To start the application:
echo   • Double-click: start-leaveflow.bat
echo   • Or run: Start-LeaveFlow.ps1
echo.
echo URLs will be:
echo   • Frontend: http://localhost:4200
echo   • Backend:  http://localhost:8080
echo.
echo Happy coding! 🎉
echo.
pause