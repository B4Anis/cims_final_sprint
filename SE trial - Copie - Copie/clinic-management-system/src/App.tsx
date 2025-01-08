import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import { UserManagement } from './components/UserManagement/UserManagement';
import { MedicationManagement } from './components/Medications/MedicationManagement';
import SidebarMenu from './components/SidebarMenu';
import './App.css';
import { Inox } from './components/Inox/Inoxs';
import { Consumables } from './components/Consumables/Consumables';
import { NonConsumables } from './components/Non-consumables/NonConsumables';
import { Instruments } from './components/Instruments/Instruments';
import { Login } from './components/Login/Login';
import NotificationPage from './components/NotificationPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './components/UnauthorizedPage';

// Component to handle redirects based on user role
const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === 'clinicadmin') {
    return <Navigate to="/" replace />;
  }
  return <Navigate to="/inventory" replace state={{ department: user?.department }} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          {/* Welcome Page - Only for Clinic Admin */}
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['clinicadmin']}>
              <WelcomePage />
            </ProtectedRoute>
          } />

          {/* User Management - Only for Clinic Admin */}
          <Route path="/user-management" element={
            <ProtectedRoute allowedRoles={['clinicadmin']}>
              <UserManagement />
            </ProtectedRoute>
          } />

          {/* Inventory and Department Routes - Accessible by all authenticated users */}
          <Route path="/inventory" element={
            <ProtectedRoute>
              <SidebarMenu />
            </ProtectedRoute>
          } />

          <Route path="/inox" element={
            <ProtectedRoute>
              <Inox />
            </ProtectedRoute>
          } />
          
          <Route path="/instruments" element={
            <ProtectedRoute>
              <Instruments />
            </ProtectedRoute>
          } />
          
          <Route path="/consumables" element={
            <ProtectedRoute>
              <Consumables />
            </ProtectedRoute>
          } />
          
          <Route path="/non-consumables" element={
            <ProtectedRoute>
              <NonConsumables />
            </ProtectedRoute>
          } />
          
          <Route path="/medications/:family" element={
            <ProtectedRoute>
              <MedicationManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationPage />
            </ProtectedRoute>
          } />

          {/* Catch all route - redirect to appropriate page based on role */}
          <Route path="*" element={
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;