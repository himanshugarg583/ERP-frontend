// Route utilities for managing navigation and access control

export const ROUTE_CATEGORIES = {
  PUBLIC: ['home', 'login'],
  PROTECTED: ['admin', 'teacher', 'student', 'accountant', 'parent', 'superAdmin', 'Staff', 'library', 'onlineLearning']
};

export const ROLE_DASHBOARDS = {
  admin: "/admin/dashboard",
  teacher: "/teacher/dashboard", 
  student: "/student/dashboard",
  accountant: "/AccountantDashboard",
  parent: "/ParentDashboard",
  superadmin: "/superAdminDash",
  staff: "/StaffDashboard",
  library: "/LibraryDashboard",
  onlinelearning: "/onlineLearningDash"
};

export const getRouteProtection = (category) => {
  switch (category) {
    case 'admin':
      return 'admin';
    case 'teacher':
      return 'teacher';
    case 'student':
      return 'student';
    case 'accountant':
      return 'accountant';
    case 'parent':
      return 'parent';
    case 'superAdmin':
      return 'superadmin';
    case 'Staff':
      return 'staff';
    case 'library':
      return 'library';
    case 'onlineLearning':
      return 'onlinelearning';
    default:
      return null;
  }
};

export const isPublicRoute = (category) => {
  return ROUTE_CATEGORIES.PUBLIC.includes(category);
};

export const isProtectedRoute = (category) => {
  return ROUTE_CATEGORIES.PROTECTED.includes(category);
};

export const getDashboardPath = (role) => {
  return ROLE_DASHBOARDS[role] || "/";
};

export const hasRouteAccess = (userRole, routeCategory) => {
  const requiredRole = getRouteProtection(routeCategory);
  return !requiredRole || userRole === requiredRole;
}; 