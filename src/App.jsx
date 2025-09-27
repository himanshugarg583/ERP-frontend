import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import routes from "./Routes"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Unauthorized from './Pages/Unauthorized';
import { getRouteProtection, isPublicRoute } from './utils/routeUtils';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          {Object.keys(routes).map((category) => {
            if (!isPublicRoute(category)) return null;
            
            return routes[category]?.map((route) => (
              <Route key={route?.path} path={route?.path} element={route?.element} />
            ));
          })}

          {/* Protected Routes */}
          {Object.keys(routes).map((category) => {
            if (isPublicRoute(category)) return null;
            
            const requiredRole = getRouteProtection(category);
            
            return routes[category]?.map((route) => (
              <Route
                key={route?.path}
                path={route?.path}
                element={
                  requiredRole ? (
                    <ProtectedRoute requiredRole={requiredRole}>
                      {route?.element}
                    </ProtectedRoute>
                  ) : (
                    route?.element
                  )
                }
              />
            ));
          })}

          {/* Unauthorized Route */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  )
}

export default App