import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import AdminLayout from '../layouts/AdminLayout';

// Import pages
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import NotFound from '../pages/NotFound';

// Import user screens
import Dashboard from '../screens/userScreens/Dashboard';
import Assessments from '../screens/userScreens/Assessments';
import AssessmentTest from "../screens/userScreens/AssessmentTest";

// Import admin screens
import AdminDashboard from '../screens/adminScreens/AdminDashboard';
import AssessmentList from '../screens/adminScreens/AssessmentList';
import AssessmentForm from '../screens/adminScreens/AssessmentForm';
import UserManagement from '../screens/adminScreens/UserManagement';

const PrivateRoute = ({ element, allowedRoles }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect based on user role
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (currentUser.role === 'user') {
      return <Navigate to="/dashboard" />;
    }
    return <Navigate to="/" />;
  }

  return element;
};

const Router = () => {
  const routes = useRoutes([
    // Public routes
    {
      element: <MainLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/about", element: <About /> }
      ]
    },

    // Auth routes
    {
      element: <AuthLayout />,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/forgot-password", element: <ForgotPassword /> },
        { path: "/reset-password", element: <ResetPassword /> },
      ]
    },

    // User routes
    {
      // element: <PrivateRoute element={<DashboardLayout />} allowedRoles={['user']} />,
      element: <DashboardLayout />,
      children: [
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/assessments", element: <Assessments /> },
        { path: "/assessments/:id", element: <AssessmentTest /> }
      ]
    },

    // Admin routes
    {
      // element: <PrivateRoute element={<AdminLayout />} allowedRoles={['admin']} />,
      element: <AdminLayout />,
      children: [
        { path: "/admin/dashboard", element: <AdminDashboard /> },
        { path: "/admin/assessments", element: <AssessmentList /> },
        { path: "/admin/assessments/new", element: <AssessmentForm /> },
        { path: "/admin/assessments/:id/edit", element: <AssessmentForm /> },
        { path: "/admin/users", element: <UserManagement /> }
      ]
    },

    // 404 route
    { path: "*", element: <NotFound /> }
  ]);

  return routes;
};

export default Router; 