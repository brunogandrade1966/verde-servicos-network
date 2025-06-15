import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfessionalProfile from './pages/ProfessionalProfile';
import ProfessionalProfileView from './pages/ProfessionalProfileView';
import FindProfessionals from './pages/FindProfessionals';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import BrowseProjects from './pages/BrowseProjects';
import ContractedProjects from './pages/ContractedProjects';
import Messages from './pages/Messages';
import ManageServices from './pages/ManageServices';
import Partnerships from './pages/Partnerships';
import Services from './pages/Services';
import MyProjects from './pages/MyProjects';
import MyDemands from './pages/MyDemands';
import Applications from './pages/Applications';
import { Toaster } from '@/components/ui/toaster';
import ReviewProfessional from './pages/ReviewProfessional';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
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
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Client routes with layout */}
              <Route
                path="/services"
                element={
                  <ProtectedRoute>
                    <Services />
                  </ProtectedRoute>
                }
              />
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
              {/* Existing routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfessionalProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/professionals/:id"
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
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <ProtectedRoute>
                    <ManageServices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/partnerships"
                element={
                  <ProtectedRoute>
                    <Partnerships />
                  </ProtectedRoute>
                }
              />
              <Route path="/review/:projectId" element={
                <ProtectedRoute>
                  <ReviewProfessional />
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
