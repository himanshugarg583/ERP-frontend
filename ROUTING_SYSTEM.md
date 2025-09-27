# School ERP Routing System - Updated

## 🎯 Overview
This document explains the enhanced routing system for the School ERP application with authentication protection and role-based access control.

## 🏗️ Architecture

### **1. Authentication Context** (`src/context/AuthContext.jsx`)
- ✅ Manages user authentication state
- ✅ Handles login/logout functionality  
- ✅ Provides role-based access control
- ✅ Persists user session in localStorage
- ✅ Integrates with existing API methods

### **2. Protected Routes** (`src/components/ProtectedRoute.jsx`)
- ✅ Wraps routes that require authentication
- ✅ Checks user role permissions
- ✅ Redirects unauthorized users
- ✅ Shows loading states during auth check

### **3. Route Utilities** (`src/utils/routeUtils.js`)
- ✅ Centralized route definitions
- ✅ Helper functions for route management
- ✅ Role-based route access control
- ✅ Dashboard path mapping

### **4. Updated App.jsx**
- ✅ AuthProvider wrapper
- ✅ Automatic route protection
- ✅ Clean separation of public/protected routes

## 🔐 Authentication Flow

### **Login Process**
1. User enters credentials on `/login`
2. `AuthContext.login()` calls existing API method
3. User role is determined from API response
4. User is redirected to appropriate dashboard
5. Session is stored in localStorage

### **Demo Credentials**
```
Admin: admin@gmail.com / Admin@123
Teacher: teacher@gmail.com / Teacher@123  
Student: student@gmail.com / Student@123
Accountant: accountant@gmail.com / Accountant@123
```

## 🛣️ Route Structure

### **Public Routes** (No Authentication Required)
- `/` - Home page
- `/login` - Unified login page
- `/parentLogin` - Parent login page

### **Protected Routes** (Authentication Required)

#### **Admin Routes** (`/admin/*`)
- `/AdminDashboardPage` - Main admin dashboard
- `/Admissionenquiry` - Enquiry management
- `/AddStudents` - Add new student
- `/AddTeacher` - Add new teacher
- `/AddClass` - Class management
- `/AddSubject` - Subject management
- `/AssignClass` - Class assignment
- `/AssignSubject` - Subject assignment
- `/ClassTimeTablePage` - Class timetables
- `/TeacherTimeTablePage` - Teacher timetables
- `/ViewAssignSubPage` - View subject assignments
- `/ClassAttendance` - Class attendance
- `/leave` - Leave management
- `/AttendanceReport` - Attendance reports
- `/AdmitCardPage` - Admit card management
- `/ExamTimeTable` - Exam timetables
- `/MarksRegisterPage` - Marks management
- `/ReportCardPage` - Report cards
- `/TermListPage` - Term management
- `/ExamReportPage` - Exam reports
- `/EventPage` - Event management
- `/AddExpense` - Expense management
- `/AddIncome` - Income management
- `/PaymentReceipt` - Payment receipts
- `/DemandNotice` - Demand notices
- `/FeeDiscountPage` - Fee discounts
- `/FeeReports` - Fee reports
- `/ChequePage` - Cheque management
- `/StudentReports` - Student reports
- `/Student_Crediential` - Student credentials
- `/AddAccontantPage` - Add accountant
- `/AddStaff` - Add staff
- `/AddLibrarian` - Add librarian

#### **Teacher Routes** (`/teacher/*`)
- `/TeacherPortal` - Teacher dashboard
- `/teacherSubjects` - Subject management
- `/teacherAttendance` - Attendance management
- `/teacherResult` - Result management
- `/teacherTimetable` - Timetable view
- `/teacherTransportation` - Transportation
- `/teacherAssignment` - Assignment management
- `/teacherNotice` - Notice management
- `/teacherProfile` - Teacher profile

#### **Student Routes** (`/student/*`)
- `/StudentDashboard` - Student dashboard
- `/studentattendance` - Attendance view
- `/studentsubjects` - Subject view
- `/studentassignments` - Assignment view
- `/studentresults` - Result view
- `/studentprogress` - Progress tracking
- `/studenttransport` - Transport info
- `/studentprofile` - Student profile

#### **Accountant Routes** (`/accountant/*`)
- `/AccountantDashboard` - Accountant dashboard
- `/AccountantFeeManagement` - Fee management
- `/AccountantStudentAccounts` - Student accounts
- `/AccountantExpenseManagement` - Expense management
- `/AccountantSalary` - Salary management
- `/AccountantPayments` - Payment tracking
- `/AccountantReports` - Financial reports
- `/AccountantProfile` - Accountant profile
- `/AccountantSetting` - Accountant settings

#### **Parent Routes** (`/parent/*`)
- `/ParentDashboard` - Parent dashboard
- `/ParentAttendance` - Child attendance
- `/ParentFees` - Fee management
- `/ParentTimetable` - Timetable view
- `/ParentProgress` - Progress tracking
- `/ParentResults` - Result view
- `/ParentTransport` - Transport info
- `/ParentProfile` - Parent profile
- `/ParentCommunication` - Communication
- `/ParentSetting` - Parent settings

#### **Super Admin Routes** (`/superadmin/*`)
- `/superAdminDash` - Super admin dashboard
- `/superAdminSchool` - School management
- `/superAdminSchoolList` - School list
- `/superAdminReports` - Reports
- `/superAdminAnalytics` - Analytics
- `/superAdminProfile` - Profile
- `/superAdminDetails` - Details
- `/superAdminFinancial` - Financial

#### **Staff Routes** (`/staff/*`)
- `/StaffDashboard` - Staff dashboard
- `/StationeryAssets` - Stationery assets
- `/UniformDressCode` - Uniform management
- `/ITInventory` - IT inventory
- `/SportsEquipment` - Sports equipment
- `/LabScienceEquipment` - Lab equipment
- `/LostAndFound` - Lost and found
- `/ITSupport` - IT support
- `/NetworkManagement` - Network management
- `/StaffSupport` - Staff support
- `/StaffAttendence` - Staff attendance
- `/schoolMaintenance` - School maintenance
- `/events` - Events management
- `/StaffTransport` - Staff transport

#### **Library Routes** (`/library/*`)
- `/LibraryDashboard` - Library dashboard
- `/libraryaddbook` - Add books
- `/libraryviewall` - View all books
- `/elibrary` - E-library
- `/libraryissueandreturn` - Issue and return
- `/librarystationary` - Stationary management
- `/libraryreports` - Library reports

#### **Online Learning Routes** (`/onlinelearning/*`)
- `/onlineLearningDash` - Online learning dashboard
- `/onlineLearningClass` - Online classes
- `/onlineLearningLive` - Live classes
- `/onlineLearningAssignment` - Online assignments
- `/onlineLearningProfile` - Online learning profile

## 🔒 Security Features

### **Route Protection**
- ✅ All dashboard routes are protected with `ProtectedRoute`
- ✅ Role-based access control prevents unauthorized access
- ✅ Automatic redirect to login for unauthenticated users
- ✅ Redirect to user's dashboard for wrong role access

### **Session Management**
- ✅ JWT token storage (using existing API)
- ✅ Automatic session restoration on page refresh
- ✅ Secure logout with session cleanup

## 🎯 Key Features

### **1. No Page Refresh Navigation**
- ✅ Uses React Router for client-side routing
- ✅ Smooth transitions between pages
- ✅ Maintains application state

### **2. Role-Based Access**
- ✅ Dynamic route protection based on user role
- ✅ Consistent navigation experience
- ✅ Proper error handling for unauthorized access

### **3. Centralized Route Management**
- ✅ All routes defined in `Routes.jsx`
- ✅ Easy to add new routes
- ✅ Consistent naming conventions

### **4. Error Handling**
- ✅ Loading states during authentication
- ✅ Error messages for failed login
- ✅ Graceful handling of unauthorized access

## 🚀 Usage Examples

### **Adding a New Protected Route**
```jsx
// In Routes.jsx
admin: [
  // ... existing routes
  { path: "/NewFeature", element: <NewFeatureComponent /> },
]
```

### **Checking User Role in Components**
```jsx
import { useAuth } from '../context/AuthContext';

const MyComponent = () => {
  const { user, hasRole } = useAuth();
  
  if (hasRole('admin')) {
    return <AdminOnlyContent />;
  }
  
  return <RegularContent />;
};
```

### **Programmatic Navigation**
```jsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navigate = useNavigate();
const { getDashboardPath } = useAuth();

navigate(getDashboardPath());
```

## 🔧 Configuration

### **Customizing Role Determination**
The role is determined by the API response in `AuthContext.jsx`:
```jsx
const userData = {
  id: response.id || 1,
  email,
  role: response.role.toLowerCase(), // From API
  name: response.name || 'User',
  token: response.token
};
```

### **Adding New Roles**
1. Add role to `routeUtils.js` in `ROLE_DASHBOARDS`
2. Add role protection in `getRouteProtection` function
3. Add routes to `Routes.jsx` under appropriate category
4. Update API to return correct role

## 🐛 Troubleshooting

### **Common Issues**
1. **Route not found**: Check if route is properly defined in `Routes.jsx`
2. **Unauthorized access**: Verify user role and route permissions
3. **Login not working**: Check browser console for API errors
4. **Session not persisting**: Check localStorage for authToken

### **Debug Mode**
Enable debug logging in `AuthContext.jsx`:
```jsx
console.log('User role:', user?.role);
console.log('Required role:', requiredRole);
```

## 📝 Best Practices

1. **Always use existing API methods** for authentication
2. **Define routes centrally** in `Routes.jsx`
3. **Handle loading states** for better UX
4. **Validate user permissions** before rendering sensitive content
5. **Use proper error boundaries** for error handling
6. **Test all role combinations** to ensure proper access control

## 🔄 Integration with Existing System

### **API Integration**
- Uses existing `loginUser` function from `apiMethods.js`
- Maintains current API response structure
- No changes required to backend API

### **Component Integration**
- Works with existing sidebar components
- Maintains current page structure
- No breaking changes to existing components

### **Route Integration**
- Uses existing route definitions from `Routes.jsx`
- Maintains current URL structure
- Adds protection without changing URLs

## ✅ Benefits

- ✅ **Secure** - No unauthorized access to protected routes
- ✅ **Fast** - No page refreshes during navigation
- ✅ **Scalable** - Easy to add new routes and roles
- ✅ **Maintainable** - Centralized route management
- ✅ **User-friendly** - Smooth navigation experience
- ✅ **Backward Compatible** - Works with existing codebase 