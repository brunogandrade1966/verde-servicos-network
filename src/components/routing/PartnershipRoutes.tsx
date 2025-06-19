
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import Partnerships from '../../pages/Partnerships';
import PartnershipDetails from '../../pages/PartnershipDetails';
import CreatePartnership from '../../pages/CreatePartnership';
import CreatePartnershipForm from '../../pages/CreatePartnershipForm';
import MyPartnershipRequests from '../../pages/MyPartnershipRequests';

export const PartnershipRoutes = () => (
  <>
    <Route
      path="/partnerships"
      element={
        <ProtectedRoute>
          <Partnerships />
        </ProtectedRoute>
      }
    />
    <Route
      path="/partnerships/:id"
      element={
        <ProtectedRoute>
          <PartnershipDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/partnerships/create"
      element={
        <ProtectedRoute>
          <CreatePartnership />
        </ProtectedRoute>
      }
    />
    <Route
      path="/partnerships/create-form"
      element={
        <ProtectedRoute>
          <CreatePartnershipForm />
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-partnership-requests"
      element={
        <ProtectedRoute>
          <MyPartnershipRequests />
        </ProtectedRoute>
      }
    />
  </>
);
