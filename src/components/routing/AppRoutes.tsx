
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import Dashboard from '../../pages/Dashboard';
import Services from '../../pages/Services';
import Messages from '../../pages/Messages';
import { AuthRoutes } from './AuthRoutes';
import { ProjectRoutes } from './ProjectRoutes';
import { PartnershipRoutes } from './PartnershipRoutes';
import { ProfileRoutes } from './ProfileRoutes';
import { AdminRoutes } from './AdminRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <AuthRoutes />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <Services />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      <ProjectRoutes />
      <PartnershipRoutes />
      <ProfileRoutes />
      <AdminRoutes />
    </Routes>
  );
};

export default AppRoutes;
