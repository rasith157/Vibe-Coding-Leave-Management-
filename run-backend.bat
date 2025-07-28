@echo off
echo Starting LeaveFlow Backend (Micronaut)...
echo.

REM Check if Java 17 is installed
java -version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 and add it to your PATH
    pause
    exit /b 1
)

echo Java version check:
java -version
echo.

REM Check if Maven is installed
mvn -version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Apache Maven and add it to your PATH
    echo Download from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)

echo Maven version check:
mvn -version
echo.

REM Navigate to backend directory
cd /d "%~dp0backend"

echo Building the application...
mvn clean compile
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo Starting the backend server...
echo Backend will be available at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

echo Trying Micronaut Maven plugin...
mvn mn:run
if %errorlevel% neq 0 (
    echo.
    echo Micronaut plugin failed, trying alternative method...
    mvn exec:java -Dexec.mainClass="com.leaveflow.Application"
) 