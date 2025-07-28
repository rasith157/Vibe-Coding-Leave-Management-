# LeaveFlow - Leave Management System

A comprehensive leave management application built with Micronaut (Java 17) backend and Angular frontend, featuring role-based access control and graphical analytics.

## 🚀 Features

### Employee Features
- **Leave Request Management**: Apply for different types of leaves (Annual, Sick, Casual, Emergency)
- **Leave Balance Tracking**: View remaining leave balances in real-time
- **Leave History**: Access complete leave application history
- **Dashboard**: Personal dashboard with leave statistics

### Admin Features
- **Employee Management**: View all employees and their leave information
- **Leave Approval**: Approve or reject leave requests
- **Analytics Dashboard**: Graphical representation of leave data across the organization
- **Reports**: Generate insights on leave patterns and usage

### System Features
- **Authentication & Authorization**: JWT-based secure authentication
- **Role-based Access Control**: Employee and Admin roles
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Updates**: Live data synchronization

## 🛠 Technology Stack

### Backend
- **Micronaut Framework** (Java 17)
- **SQLite Database**
- **Micronaut Data JDBC**
- **JWT Security**
- **Gradle Build System**

### Frontend
- **Angular 17** (Standalone Components)
- **TypeScript**
- **Chart.js** for analytics
- **Tailwind-inspired CSS**
- **Responsive Design**

## 📋 Prerequisites

- Java 17 (CO-Oracle-JDK-17.00.13-64)
- Node.js 18+ and npm
- Git

## 🔧 Installation & Setup

### 🪟 Windows Users (Recommended)

**For detailed Windows setup, see: [WINDOWS-SETUP.md](WINDOWS-SETUP.md)**

#### Quick Start for Windows:
1. **Double-click** `setup.bat` to install dependencies
2. **Double-click** `start-leaveflow.bat` to run the application
3. Choose option **3** to start both services
4. Open `http://localhost:4200` in your browser

### 🐧 Linux/Mac Users

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd leaveflow
```

#### 2. Backend Setup (Micronaut)
```bash
cd backend

# Make sure you have Java 17 installed
java -version

# Build the application
./gradlew build

# Run the application
./gradlew run
```

The backend will start on `http://localhost:8080`

#### 3. Frontend Setup (Angular)
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start on `http://localhost:4200`

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `first_name` - User's first name
- `last_name` - User's last name
- `email` - Unique email address
- `password` - Hashed password
- `role` - EMPLOYEE or ADMIN
- `active` - Account status
- `annual_leave_balance` - Annual leave days remaining
- `sick_leave_balance` - Sick leave days remaining
- `casual_leave_balance` - Casual leave days remaining
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Leaves Table
- `id` - Primary key
- `user_id` - Foreign key to Users
- `leave_type` - ANNUAL, SICK, CASUAL, EMERGENCY
- `start_date` - Leave start date
- `end_date` - Leave end date
- `duration` - Number of days
- `reason` - Leave reason
- `status` - PENDING, APPROVED, REJECTED
- `approved_by` - Admin user who approved/rejected
- `approved_at` - Approval timestamp
- `comments` - Admin comments
- `created_at` - Request creation timestamp
- `updated_at` - Last update timestamp

### History Table
- `id` - Primary key
- `user_id` - Foreign key to Users
- `leave_id` - Foreign key to Leaves
- `action` - APPLIED, APPROVED, REJECTED, MODIFIED, CANCELLED
- `description` - Action description
- `performed_by` - User who performed the action
- `old_status` - Previous status (if applicable)
- `new_status` - New status (if applicable)
- `additional_data` - JSON string for extra data
- `timestamp` - Action timestamp

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Management
- `GET /api/users/profile` - Get current user profile
- `GET /api/users/employees` - Get all employees (Admin only)

### Leave Management
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves/my` - Get user's leaves
- `GET /api/leaves` - Get all leaves (Admin only)
- `PUT /api/leaves/{id}/approve` - Approve leave (Admin only)
- `PUT /api/leaves/{id}/reject` - Reject leave (Admin only)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/leave-trends` - Leave trend data (Admin only)

## 🎨 UI Components

### Home Page
- Modern landing page with LeaveFlow branding
- Feature highlights (Easy Request Management, Automated Approvals, Analytics & Insights)
- Call-to-action buttons for login/registration

### Login Page
- Clean login form with email/password fields
- Social login options (Google, GitHub)
- Forgot password link
- Responsive design

### Registration Page
- User-friendly registration form
- Form validation and password confirmation
- Terms of service agreement
- Social registration options

### Employee Dashboard
- Leave balance display
- Quick leave application
- Recent leave history
- Upcoming leave calendar

### Admin Dashboard
- Organization-wide leave statistics
- Pending approvals queue
- Employee leave analytics with charts
- Leave trend visualization

## 🚀 Running the Application

1. **Start the Backend**:
   ```bash
   cd backend
   ./gradlew run
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Application**:
   - Open your browser to `http://localhost:4200`
   - Register a new account or use default credentials
   - Navigate through the application features

## 👥 Default Users

The application will create default users on first run:

### Admin User
- Email: `admin@leaveflow.com`
- Password: `admin123`
- Role: ADMIN

### Employee User
- Email: `employee@leaveflow.com`
- Password: `employee123`
- Role: EMPLOYEE

## 🔧 Development

### Backend Development
```bash
cd backend
./gradlew run --continuous
```

### Frontend Development
```bash
cd frontend
npm run watch
```

## 🐛 Troubleshooting

### Common Issues

1. **Java Version Error**:
   - Ensure Java 17 is installed and JAVA_HOME is set correctly

2. **Port Already in Use**:
   - Backend: Change port in `application.yml`
   - Frontend: Use `ng serve --port 4201`

3. **Database Issues**:
   - Delete `leaveflow.db` file to reset database
   - Application will recreate tables on startup

4. **CORS Errors**:
   - Ensure backend CORS configuration includes frontend URL

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository. 

## 🚀 **Try Your Frontend Now:**

### **Option 1: Use your launcher (Recommended)**
```cmd
start-leaveflow.bat
```
Choose option **2** (Frontend only) or **3** (Both backend and frontend)

### **Option 2: Use PowerShell launcher**
```powershell
.\Start-LeaveFlow.ps1
```

### **Option 3: Manual frontend run**
```cmd
cd frontend
npm install --legacy-peer-deps
npm start
```

### **Option 4: Alternative if issues persist**
```cmd
cd frontend
npm install --force
npm start
```

## 📋 **What I Fixed:**

1. ✅ **Downgraded ng2-charts** to version 5.0.4 (compatible with Angular 17)
2. ✅ **Added @angular/cdk** version 17.3.10 (compatible with Angular 17)  
3. ✅ **Updated run scripts** to use `--legacy-peer-deps` flag
4. ✅ **Added fallback methods** with `--force` flag
5. ✅ **Cleaned old dependencies** (`node_modules` and `package-lock.json`)

## 🎯 **Expected Result:**

Your frontend should now install dependencies successfully and start on `http://localhost:4200`

The dependency conflicts between Angular 17 and newer packages have been resolved. Try running `start-leaveflow.bat` now - it should work! 🎉

If you still encounter issues, the scripts will automatically try the alternative installation methods. #   V i b e - C o d i n g - L e a v e - M a n a g e m e n t -  
 