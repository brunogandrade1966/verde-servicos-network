
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import ManageServices from '../../pages/ManageServices';
import ImportServicesPage from '../../pages/ImportServices';

export const AdminRoutes = () => (
  <>
    <Route
      path="/admin/services"
      element={
        <ProtectedRoute>
          <ManageServices />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/import-services"
      element={
        <ProtectedRoute>
          <ImportServicesPage />
        </ProtectedRoute>
      }
    />
  </>
);
