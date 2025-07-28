# 🪟 LeaveFlow - Windows Setup Guide

This guide will help you set up and run the LeaveFlow application on Windows 10/11.

## 📋 Prerequisites

### 1. **Java 17**
- Download from: [Oracle JDK 17](https://www.oracle.com/java/technologies/downloads/#java17)
- Choose: **Windows x64 Installer**
- Install and make sure it's added to your system PATH
- Verify installation:
  ```cmd
  java -version
  ```

### 2. **Apache Maven 3.6+**
- Download from: [Apache Maven](https://maven.apache.org/download.cgi)
- Choose: **Binary zip archive**
- Extract to a folder (e.g., `C:\maven`)
- Add `C:\maven\bin` to your system PATH
- Verify installation:
  ```cmd
  mvn -version
  ```

### 3. **Node.js 18+ and npm**
- Download from: [Node.js Official Website](https://nodejs.org/)
- Choose: **LTS version (Recommended for most users)**
- Install the Windows Installer (.msi)
- Verify installation:
  ```cmd
  node --version
  npm --version
  ```

### 4. **Git (Optional but recommended)**
- Download from: [Git for Windows](https://git-scm.com/download/win)

## 🚀 Quick Start

### Option 1: Easy Launcher (Recommended)

1. **Double-click** `start-leaveflow.bat` in the project root
2. Choose option **3** to start both backend and frontend
3. Wait for both services to start
4. Open your browser to `http://localhost:4200`

### Option 2: PowerShell Users

1. **Right-click** on `Start-LeaveFlow.ps1` → **Run with PowerShell**
2. If you get execution policy error, run this first:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
3. Choose option **3** to start both services

### Option 3: Manual Commands

#### Command Prompt (cmd):
```cmd
# Terminal 1 - Backend
cd backend
mvn clean install
  mvn mn:run

# Terminal 2 - Frontend (new window)
cd frontend
npm install
npm start
```

#### PowerShell:
```powershell
# Terminal 1 - Backend
Set-Location backend
mvn clean install
mvn mn:run

# Terminal 2 - Frontend (new window)
Set-Location frontend
npm install
npm start
```

## 🛠 Available Scripts

### Batch Files (.bat)
- `start-leaveflow.bat` - Interactive launcher with menu
- `run-backend.bat` - Start only the backend
- `run-frontend.bat` - Start only the frontend

### PowerShell Scripts (.ps1)
- `Start-LeaveFlow.ps1` - PowerShell launcher with menu
- Use parameters: `-Backend`, `-Frontend`, `-Both`, `-Check`

## 🌐 Application URLs

Once both services are running:

- **Frontend (Angular)**: http://localhost:4200
- **Backend API (Micronaut)**: http://localhost:8080
- **Database**: SQLite file `leaveflow.db` (auto-created)

## 🔧 Troubleshooting

### Common Windows Issues

#### 1. **Java Not Found Error**
```
'java' is not recognized as an internal or external command
```
**Solution:**
- Verify Java 17 is installed
- Add Java to your PATH:
  1. Search "Environment Variables" in Windows
  2. Edit system environment variables
  3. Add `C:\Program Files\Java\jdk-17\bin` to PATH
  4. Restart Command Prompt

#### 2. **Node.js Not Found Error**
```
'node' is not recognized as an internal or external command
```
**Solution:**
- Reinstall Node.js from nodejs.org
- Make sure to check "Add to PATH" during installation
- Restart Command Prompt

#### 3. **PowerShell Execution Policy Error**
```
execution of scripts is disabled on this system
```
**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 4. **Port Already in Use**
```
Port 8080 is already in use
```
**Solution:**
- Kill the process using the port:
```cmd
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

#### 5. **Maven Build Fails**
**Solution:**
- Delete the `.mvn` folder in the backend directory
- Run the build again
- Check internet connection (Maven downloads dependencies)

### 6. **Angular Build Fails**
**Solution:**
- Delete `node_modules` folder in frontend directory
- Delete `package-lock.json`
- Run `npm install` again

## 🔐 Firewall and Antivirus

If your firewall or antivirus blocks the application:

1. **Windows Defender:**
   - Allow `java.exe` and `node.exe` through Windows Defender Firewall
   
2. **Third-party Antivirus:**
   - Add project folder to exclusions
   - Allow `mvn` commands

## 📁 Project Structure

```
LeaveFlow/
├── backend/               # Micronaut application
│   ├── src/
│   ├── pom.xml           # Maven configuration
│   └── target/           # Maven build output
├── frontend/             # Angular application
│   ├── src/
│   ├── package.json
│   └── angular.json
├── start-leaveflow.bat   # Windows batch launcher
├── Start-LeaveFlow.ps1   # PowerShell launcher
├── run-backend.bat       # Backend only
├── run-frontend.bat      # Frontend only
└── README.md
```

## 🎯 Default User Accounts

The application creates default accounts on first run:

### Admin Account
- **Email**: `admin@leaveflow.com`
- **Password**: `admin123`
- **Role**: ADMIN

### Employee Account
- **Email**: `employee@leaveflow.com`
- **Password**: `employee123`
- **Role**: EMPLOYEE

## 🚦 Development Mode

For development with auto-reload:

### Backend (Continuous Build)
```cmd
cd backend
mvn mn:run
```

### Frontend (Watch Mode)
```cmd
cd frontend
npm run watch
```

## 📱 Browser Compatibility

Recommended browsers:
- ✅ Google Chrome (Latest)
- ✅ Microsoft Edge (Latest)
- ✅ Mozilla Firefox (Latest)
- ⚠️ Internet Explorer (Not supported)

## 💡 Tips for Windows Users

1. **Use Windows Terminal** for better experience
2. **Pin the batch files** to taskbar for quick access
3. **Create desktop shortcuts** to the launcher scripts
4. **Run as Administrator** if you encounter permission issues
5. **Disable real-time scanning** for the project folder in antivirus (temporarily)

## 🆘 Getting Help

If you encounter issues:

1. **Check Prerequisites**: Run the prerequisite checker in the launcher
2. **Check Logs**: Look at the console output for error messages
3. **Restart Services**: Stop and restart both backend and frontend
4. **Clear Cache**: Delete `node_modules` and `.gradle` folders, then reinstall
5. **Check Ports**: Ensure ports 8080 and 4200 are not being used by other applications

## 🔄 Updating the Application

To update dependencies:

### Backend
```cmd
cd backend
mvn clean
mvn compile
```

### Frontend
```cmd
cd frontend
npm update
```

---

**Happy coding with LeaveFlow on Windows! 🎉** 

## 🔧 **Installing Apache Maven on Windows**

### **Step 1: Download Maven**
1. Go to: https://maven.apache.org/download.cgi
2. Download: **apache-maven-3.9.5-bin.zip** (or latest version)
3. Save it to your Downloads folder

### **Step 2: Extract Maven**
1. Extract the zip file to `C:\maven` (or `C:\Program Files\Apache\maven`)
2. You should have: `C:\maven\apache-maven-3.9.5\` with `bin`, `conf`, `lib` folders

### **Step 3: Add Maven to PATH**
1. **Open Environment Variables:**
   - Press `Windows + R`, type `sysdm.cpl`, press Enter
   - Click **"Environment Variables"**

2. **Add Maven to PATH:**
   - In "System Variables", find and select **PATH**
   - Click **"Edit"**
   - Click **"New"** 
   - Add: `C:\maven\apache-maven-3.9.5\bin`
   - Click **"OK"** on all dialogs

### **Step 4: Verify Installation**
1. **Close and reopen your PowerShell/Command Prompt**
2. Test Maven:
   ```cmd
   mvn -version
   ```

You should see output like:
```
Apache Maven 3.9.5
Maven home: C:\maven\apache-maven-3.9.5
Java version: 17.0.x
```

### **Step 5: Fix the pom.xml**
Quick fix needed in `backend/pom.xml` line 13: 

## 🚀 **To Fix and Test Your Backend:**

1. **Install Maven first** (choose one):
   - **Automated**: Run `.\install-maven.ps1` as Administrator
   - **Manual**: Download from https://maven.apache.org/download.cgi

2. **Then test your backend**:
   ```cmd
   # After Maven is installed
   cd backend
   mvn clean compile
   mvn mn:run
   ```

3. **Or use your launcher**:
   ```cmd
   start-leaveflow.bat
   ```

The compilation errors in `JwtService.java` are now fixed! The issue was that the JWT library returns `Object` types for claims, but your methods expected `String` types. I've added proper type casting with null safety.

**Would you like to run the Maven installation script now, or do you prefer to install Maven manually?** 