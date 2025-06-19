
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import ProfessionalProfile from '../../pages/ProfessionalProfile';
import ProfessionalProfileView from '../../pages/ProfessionalProfileView';
import FindProfessionals from '../../pages/FindProfessionals';

export const ProfileRoutes = () => (
  <>
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <ProfessionalProfile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/professionals/:professionalId"
      element={
        <ProtectedRoute>
          <ProfessionalProfileView />
        </ProtectedRoute>
      }
    />
    <Route
      path="/professionals"
      element={
        <ProtectedRoute>
          <FindProfessionals />
        </ProtectedRoute>
      }
    />
  </>
);
