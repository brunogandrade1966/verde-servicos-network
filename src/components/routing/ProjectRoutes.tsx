
import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import ProjectDetails from '../../pages/ProjectDetails';
import CreateProject from '../../pages/CreateProject';
import BrowseProjects from '../../pages/BrowseProjects';
import ContractedProjects from '../../pages/ContractedProjects';
import MyProjects from '../../pages/MyProjects';
import MyDemands from '../../pages/MyDemands';
import Applications from '../../pages/Applications';
import MyApplications from '../../pages/MyApplications';
import ReviewProfessional from '../../pages/ReviewProfessional';

export const ProjectRoutes = () => (
  <>
    <Route
      path="/my-projects"
      element={
        <ProtectedRoute>
          <MyProjects />
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-demands"
      element={
        <ProtectedRoute>
          <MyDemands />
        </ProtectedRoute>
      }
    />
    <Route
      path="/applications"
      element={
        <ProtectedRoute>
          <Applications />
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-applications"
      element={
        <ProtectedRoute>
          <MyApplications />
        </ProtectedRoute>
      }
    />
    <Route
      path="/projects/:id"
      element={
        <ProtectedRoute>
          <ProjectDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="/create-project"
      element={
        <ProtectedRoute>
          <CreateProject />
        </ProtectedRoute>
      }
    />
    <Route
      path="/projects"
      element={
        <ProtectedRoute>
          <BrowseProjects />
        </ProtectedRoute>
      }
    />
    <Route
      path="/contracted-projects"
      element={
        <ProtectedRoute>
          <ContractedProjects />
        </ProtectedRoute>
      }
    />
    <Route path="/review/:projectId" element={
      <ProtectedRoute>
        <ReviewProfessional />
      </ProtectedRoute>
    } />
  </>
);
