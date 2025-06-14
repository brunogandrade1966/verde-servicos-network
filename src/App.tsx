import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfessionalProfile from './pages/ProfessionalProfile';
import ProfessionalProfileView from './pages/ProfessionalProfileView';
import Professionals from './pages/Professionals';
import ProjectDetails from './pages/ProjectDetails';
import CreateProject from './pages/CreateProject';
import Projects from './pages/Projects';
import ContractedProjects from './pages/ContractedProjects';
import Messages from './pages/Messages';
import AdminServices from './pages/AdminServices';
import Partnerships from './pages/Partnerships';
import { Toaster } from '@/components/ui/toaster';
import ReviewProfessional from './pages/ReviewProfessional';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
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
                    <Professionals />
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
                    <Projects />
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
                    <AdminServices />
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
