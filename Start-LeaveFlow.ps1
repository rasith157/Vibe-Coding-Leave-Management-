# LeaveFlow - Leave Management System PowerShell Launcher
# For Windows PowerShell users

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   LeaveFlow - Leave Management" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host

function Test-Prerequisites {
    Write-Host "Checking Prerequisites..." -ForegroundColor Yellow
    Write-Host

    # Check Java
    Write-Host "Checking Java 17..." -NoNewline
    try {
        $javaVersion = java -version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✅ Java is installed" -ForegroundColor Green
            Write-Host $javaVersion[0] -ForegroundColor Gray
        } else {
            throw "Java not found"
        }
    } catch {
        Write-Host " ❌ Java 17 NOT FOUND" -ForegroundColor Red
        Write-Host "Please install Java 17 from: https://www.oracle.com/java/technologies/downloads/#java17" -ForegroundColor Yellow
    }
    Write-Host

    # Check Maven
    Write-Host "Checking Maven..." -NoNewline
    try {
        $mavenVersion = mvn -version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✅ Maven is installed" -ForegroundColor Green
            Write-Host "Version: $(mvn -version | Select-String 'Apache Maven' | Select-Object -First 1)" -ForegroundColor Gray
        } else {
            throw "Maven not found"
        }
    } catch {
        Write-Host " ❌ Maven NOT FOUND" -ForegroundColor Red
        Write-Host "Please install Apache Maven from: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
    }
    Write-Host

    # Check Node.js
    Write-Host "Checking Node.js..." -NoNewline
    try {
        $nodeVersion = node --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✅ Node.js is installed" -ForegroundColor Green
            Write-Host "Version: $nodeVersion" -ForegroundColor Gray
        } else {
            throw "Node.js not found"
        }
    } catch {
        Write-Host " ❌ Node.js NOT FOUND" -ForegroundColor Red
        Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    }
    Write-Host

    # Check npm
    Write-Host "Checking npm..." -NoNewline
    try {
        $npmVersion = npm --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✅ npm is installed" -ForegroundColor Green
            Write-Host "Version: $npmVersion" -ForegroundColor Gray
        } else {
            throw "npm not found"
        }
    } catch {
        Write-Host " ❌ npm NOT FOUND" -ForegroundColor Red
    }
    Write-Host
}

function Start-Backend {
    Write-Host "Starting LeaveFlow Backend (Micronaut)..." -ForegroundColor Green
    Set-Location "backend"
    
    Write-Host "Building the application..." -ForegroundColor Yellow
    & mvn clean compile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Starting the backend server..." -ForegroundColor Green
        Write-Host "Backend will be available at: http://localhost:8080" -ForegroundColor Cyan
        Write-Host "Trying Micronaut Maven plugin..." -ForegroundColor Yellow
        & mvn mn:run
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Micronaut plugin failed, trying alternative method..." -ForegroundColor Yellow
            & mvn exec:java -Dexec.mainClass="com.leaveflow.Application"
        }
    } else {
        Write-Host "Build failed!" -ForegroundColor Red
        pause
    }
}

function Start-Frontend {
    Write-Host "Starting LeaveFlow Frontend (Angular)..." -ForegroundColor Green
    Set-Location "frontend"
    
    # Check if node_modules exists
    if (!(Test-Path "node_modules")) {
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        Write-Host "Using legacy peer deps to resolve Angular version conflicts..." -ForegroundColor Cyan
        npm install --legacy-peer-deps
        if ($LASTEXITCODE -ne 0) {
            Write-Host "First attempt failed, trying with --force flag..." -ForegroundColor Yellow
            npm install --force
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to install dependencies!" -ForegroundColor Red
                Write-Host "Try manually: cd frontend && npm install --legacy-peer-deps" -ForegroundColor Yellow
            pause
            return
            }
        }
    }
    
    Write-Host "Starting the Angular development server..." -ForegroundColor Green
    Write-Host "Frontend will be available at: http://localhost:4200" -ForegroundColor Cyan
    npm start
}

function Start-Both {
    Write-Host "Starting both Backend and Frontend..." -ForegroundColor Green
    Write-Host "Opening separate PowerShell windows..." -ForegroundColor Yellow
    
    # Start backend in new window
    Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "& { Set-Location '$PWD'; & '.\Start-LeaveFlow.ps1' -Backend }"
    
    Start-Sleep -Seconds 3
    
    # Start frontend in new window  
    Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "& { Set-Location '$PWD'; & '.\Start-LeaveFlow.ps1' -Frontend }"
    
    Write-Host
    Write-Host "Both services are starting in separate windows." -ForegroundColor Green
    Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:4200" -ForegroundColor Cyan
    Write-Host
    Write-Host "Press any key to close this window..."
    $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Handle command line parameters
param(
    [switch]$Backend,
    [switch]$Frontend,
    [switch]$Both,
    [switch]$Check
)

if ($Backend) {
    Start-Backend
    return
}

if ($Frontend) {
    Start-Frontend
    return
}

if ($Both) {
    Start-Both
    return
}

if ($Check) {
    Test-Prerequisites
    return
}

# Interactive menu
do {
    Clear-Host
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host "   LeaveFlow - Leave Management" -ForegroundColor Cyan
    Write-Host "====================================" -ForegroundColor Cyan
    Write-Host

    Write-Host "What would you like to do?"
    Write-Host "1. Start Backend only (Micronaut on port 8080)" -ForegroundColor White
    Write-Host "2. Start Frontend only (Angular on port 4200)" -ForegroundColor White
    Write-Host "3. Start Both (Recommended for full application)" -ForegroundColor Green
    Write-Host "4. Check Prerequisites" -ForegroundColor Yellow
    Write-Host "5. Exit" -ForegroundColor Red
    Write-Host

    $choice = Read-Host "Enter your choice (1-5)"

    switch ($choice) {
        "1" { Start-Backend; break }
        "2" { Start-Frontend; break }
        "3" { Start-Both; break }
        "4" { Test-Prerequisites; Write-Host "Press any key to continue..."; $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") }
        "5" { 
            Write-Host "Thank you for using LeaveFlow!" -ForegroundColor Green
            exit 
        }
        default { 
            Write-Host "Invalid choice. Please select 1-5." -ForegroundColor Red
            Start-Sleep -Seconds 2
        }
    }
} while ($true) 