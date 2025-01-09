# Clinic Inventory Management System (CIMS)

## Overview
CIMS is a comprehensive inventory management system designed for clinics to efficiently manage their medical supplies, instruments, and equipment. The system supports multiple user roles, real-time inventory tracking, and department-specific management.

## Features
- **User Management**
  - Multiple user roles (Clinic Admin, Department Admin, Department User)
  - Role-based access control
  - User status management (Active, Inactive, Suspended)

- **Inventory Management**
  - Real-time stock tracking
  - Low stock alerts
  - Expiry date monitoring
  - Stock movement history

- **Department-Specific Features**
  - Separate inventory views for different departments
  - Department-specific stock management
  - Customized access levels

- **Purchase Orders**
  - Automated purchase order generation
  - Supplier management
  - Order tracking
  - Only accessible to admin roles

## User Roles and Permissions

### Clinic Admin
- Full system access
- User management
- All inventory operations
- System configuration
- Reports generation
- tracking users activity 

### Department Admin
- Department-specific inventory management
- Stock updates
- Purchase order creation
- Report generation for their department

### Department User
- View department inventory
- stock reports
- stock consumption

## Technical Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   cd clinic-management-system
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with:
   ```
   REACT_APP_API_URL=http://localhost:5000
   MONGODB_URI=mongodb://localhost:27017/cims
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm start
   ```

### Local Network Setup
To use CIMS across multiple devices in a local network:

1. Server Setup:
   - Designate a computer as the server
   - Install Node.js and MongoDB
   - Configure MongoDB to accept remote connections
   - Set up proper network security

2. Network Configuration:
   - Set static IP for server
   - Configure firewall rules
   - Open necessary ports (5000 for API, 27017 for MongoDB)

3. Client Setup:
   - Update API endpoint in frontend to point to server IP
   - Ensure all devices are on the same network
   - Test connectivity from each client

## Running the Application

### 1. Starting the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd clinic-management-backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cims
   JWT_SECRET=your_jwt_secret
   ```

4. Start MongoDB (if running locally):
   ```bash
   # Windows
   "C:\Program Files\MongoDB\Server\{version}\bin\mongod.exe"
   ```

5. Start the backend server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### 2. Starting the Frontend Application
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd clinic-management-system
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the frontend application:
   ```bash
   npm start
   ```

The application will open automatically in your default browser at `http://localhost:3000`

### 3. Creating Initial Users
1. Navigate to the scripts directory in the backend:
   ```bash
   cd clinic-management-backend/scripts
   ```

2. Run the createUser script:
   ```bash
   node createUser.js
   ```

3. change the following in the file to create users with different roles:
   ```
   ? Enter user email: john@clinic.com
   ? Enter user password: ****
   ? Enter user role (clinicadmin/departmentadmin/department user): departmentadmin
   ? Enter user status (active/inactive/suspended): active
   ? Enter department name (for department admin/user): cardiology
   ```

4. Available Roles:
   - clinicadmin: Full system access
   - departmentadmin: Department-specific management
   - department user: Basic department access

5. User Status Options:
   - active: Can log in and use the system
   - inactive: Account exists but did not log in 
   - suspended: Temporarily blocked from logging in





### 4. Verifying the Setup
. Frontend verification:
   - Login page should load at `http://localhost:3000`
   - Try logging in with admin credentials
   - Navigate through different sections

### 5. Common Startup Issues
1. Port Conflicts
   - Backend: If port 5000 is in use, modify PORT in backend `.env`
   - Frontend: If port 3000 is in use, choose different port when prompted

2. MongoDB Connection
   - Ensure MongoDB is running
   - Check MongoDB connection string
   - Verify network access if using remote database

3. API Connection
   - Verify backend URL in frontend `.env`
   - Check for CORS issues in browser console
   - Ensure both servers are running


## Security Features
- JWT-based authentication
- Password encryption
- Role-based access control
- Session management
- User status validation
- API route protection

## Database Structure
- Users Collection
- Inventory Collections (by type)
- Activity Logs
- Purchase Orders
- Supplier Information

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register (admin only)

### Users
- GET /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

### Inventory
- GET /api/inventory/:department
- POST /api/inventory/add
- PUT /api/inventory/update
- DELETE /api/inventory/:id

## Maintenance

### Backup
Regular database backups:
```bash
mongodump --out /backup/path
```


## Troubleshooting

### Common Issues
1. Connection Issues
   - Check network connectivity
   - Verify server is running
   - Check firewall settings

2. Authentication Issues
   - Verify user credentials in mongodb compass
   - Check user status
   - Ensure proper role assignment



