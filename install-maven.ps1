# Maven Installation Script for Windows
# This script downloads and installs Apache Maven automatically

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   Apache Maven Installation" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  For best results, run this script as Administrator" -ForegroundColor Yellow
    Write-Host "   (Right-click PowerShell -> Run as Administrator)" -ForegroundColor Yellow
    Write-Host
}

# Configuration
$mavenVersion = "3.9.5"
$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$installDir = "C:\maven"
$mavenHome = "$installDir\apache-maven-$mavenVersion"

Write-Host "Installing Apache Maven $mavenVersion..." -ForegroundColor Green
Write-Host "Installation directory: $installDir" -ForegroundColor Gray
Write-Host

# Create installation directory
Write-Host "Creating installation directory..." -NoNewline
try {
    if (Test-Path $installDir) {
        Write-Host " (Directory already exists)" -ForegroundColor Yellow
    } else {
        New-Item -ItemType Directory -Path $installDir -Force | Out-Null
        Write-Host " ✅" -ForegroundColor Green
    }
} catch {
    Write-Host " ❌ Failed to create directory" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Download Maven
$zipPath = "$env:TEMP\apache-maven-$mavenVersion-bin.zip"
Write-Host "Downloading Maven..." -NoNewline

try {
    if (Test-Path $zipPath) {
        Write-Host " (Using cached download)" -ForegroundColor Yellow
    } else {
        Invoke-WebRequest -Uri $mavenUrl -OutFile $zipPath -UseBasicParsing
        Write-Host " ✅" -ForegroundColor Green
    }
} catch {
    Write-Host " ❌ Failed to download" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check your internet connection and try again." -ForegroundColor Yellow
    exit 1
}

# Extract Maven
Write-Host "Extracting Maven..." -NoNewline
try {
    if (Test-Path $mavenHome) {
        Write-Host " (Maven already extracted)" -ForegroundColor Yellow
    } else {
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $installDir)
        Write-Host " ✅" -ForegroundColor Green
    }
} catch {
    Write-Host " ❌ Failed to extract" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Add to PATH
Write-Host "Adding Maven to PATH..." -NoNewline
try {
    $mavenBinPath = "$mavenHome\bin"
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
    
    if ($currentPath -like "*$mavenBinPath*") {
        Write-Host " (Already in PATH)" -ForegroundColor Yellow
    } else {
        $newPath = "$currentPath;$mavenBinPath"
        [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
        Write-Host " ✅" -ForegroundColor Green
        Write-Host "   Added: $mavenBinPath" -ForegroundColor Gray
    }
} catch {
    Write-Host " ❌ Failed to update PATH" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You may need to run this script as Administrator" -ForegroundColor Yellow
}

# Set MAVEN_HOME (optional but recommended)
Write-Host "Setting MAVEN_HOME..." -NoNewline
try {
    [Environment]::SetEnvironmentVariable("MAVEN_HOME", $mavenHome, "Machine")
    Write-Host " ✅" -ForegroundColor Green
    Write-Host "   MAVEN_HOME: $mavenHome" -ForegroundColor Gray
} catch {
    Write-Host " ⚠️  Could not set MAVEN_HOME" -ForegroundColor Yellow
}

# Clean up
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Write-Host
Write-Host "✅ Maven installation completed!" -ForegroundColor Green
Write-Host
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Close and reopen your PowerShell/Command Prompt" -ForegroundColor White
Write-Host "2. Test Maven installation: mvn -version" -ForegroundColor White
Write-Host "3. Navigate to your project and run: mvn clean compile" -ForegroundColor White
Write-Host
Write-Host "🔧 Installation Details:" -ForegroundColor Cyan
Write-Host "   Maven Home: $mavenHome" -ForegroundColor Gray
Write-Host "   Maven Bin:  $mavenHome\bin" -ForegroundColor Gray
Write-Host

# Test Maven (if PATH was updated successfully)
Write-Host "Testing Maven installation..." -ForegroundColor Yellow
try {
    # Refresh environment variables for current session
    $env:PATH = [Environment]::GetEnvironmentVariable("PATH", "Machine")
    $mavenTest = & "$mavenHome\bin\mvn.cmd" -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Maven is working correctly!" -ForegroundColor Green
        Write-Host $mavenTest[0] -ForegroundColor Gray
    } else {
        Write-Host "⚠️  Maven may need a system restart to work properly" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Please restart your terminal and test with: mvn -version" -ForegroundColor Yellow
}

Write-Host
Write-Host "🚀 Ready to use Maven with LeaveFlow!" -ForegroundColor Green
Write-Host "   Run: start-leaveflow.bat" -ForegroundColor White 