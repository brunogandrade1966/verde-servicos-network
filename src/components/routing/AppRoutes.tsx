
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import Dashboard from '../../pages/Dashboard';
import Services from '../../pages/Services';
import Messages from '../../pages/Messages';
import Index from '../../pages/Index';
import Login from '../../pages/Login';
import Register from '../../pages/Register';
import ProfessionalProfile from '../../pages/ProfessionalProfile';
import ProfessionalProfileView from '../../pages/ProfessionalProfileView';
import FindProfessionals from '../../pages/FindProfessionals';
import Partnerships from '../../pages/Partnerships';
import PartnershipDetails from '../../pages/PartnershipDetails';
import CreatePartnership from '../../pages/CreatePartnership';
import CreatePartnershipForm from '../../pages/CreatePartnershipForm';
import MyPartnershipRequests from '../../pages/MyPartnershipRequests';
import ProjectDetails from '../../pages/ProjectDetails';
import CreateProject from '../../pages/CreateProject';
import BrowseProjects from '../../pages/BrowseProjects';
import ContractedProjects from '../../pages/ContractedProjects';
import MyProjects from '../../pages/MyProjects';
import MyDemands from '../../pages/MyDemands';
import Applications from '../../pages/Applications';
import MyApplications from '../../pages/MyApplications';
import ReviewProfessional from '../../pages/ReviewProfessional';
import ManageServices from '../../pages/ManageServices';
import ImportServicesPage from '../../pages/ImportServices';
import Reports from '../../pages/Reports';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
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
      
      {/* Dashboard Routes */}
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

      {/* Project Routes */}
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

      {/* Reports Route */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Partnership Routes */}
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

      {/* Profile Routes */}
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

      {/* Admin Routes */}
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
    </Routes>
  );
};

export default AppRoutes;
