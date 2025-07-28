@echo off
echo Starting LeaveFlow Frontend (Angular)...
echo.

REM Check if Node.js is installed
node --version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo npm version:
npm --version
echo.

REM Navigate to frontend directory
cd /d "%~dp0frontend"

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    echo Using legacy peer deps to resolve Angular version conflicts...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo.
        echo First attempt failed, trying with --force flag...
        npm install --force
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
            echo Try manually: cd frontend && npm install --legacy-peer-deps
        pause
        exit /b 1
        )
    )
    echo.
)

echo Starting the Angular development server...
echo Frontend will be available at: http://localhost:4200
echo Press Ctrl+C to stop the server
echo.

npm start 