
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import Index from '../../pages/Index';
import Login from '../../pages/Login';
import Register from '../../pages/Register';

export const AuthRoutes = () => (
  <>
    <Route path="/" element={
      <ProtectedRoute requireAuth={false}>
        <Index />
      </ProtectedRoute>
    } />
    <Route path="/login" element={
      <ProtectedRoute requireAuth={false}>
        <Login />
      </ProtectedRoute>
    } />
    <Route path="/register" element={
      <ProtectedRoute requireAuth={false}>
        <Register />
      </ProtectedRoute>
    } />
  </>
);
