
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import CreateProject from "./pages/CreateProject";
import BrowseProjects from "./pages/BrowseProjects";
import ProjectDetails from "./pages/ProjectDetails";
import EditProject from "./pages/EditProject";
import ApplyToProject from "./pages/ApplyToProject";
import FindProfessionals from "./pages/FindProfessionals";
import ProfessionalProfileView from "./pages/ProfessionalProfileView";
import Messages from "./pages/Messages";
import Partnerships from "./pages/Partnerships";
import PartnershipDetails from "./pages/PartnershipDetails";
import ApplyToPartnership from "./pages/ApplyToPartnership";
import ManageServices from "./pages/ManageServices";
import ContractedProjects from "./pages/ContractedProjects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id/edit"
              element={
                <ProtectedRoute>
                  <EditProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id/apply"
              element={
                <ProtectedRoute>
                  <ApplyToProject />
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
              path="/professionals"
              element={
                <ProtectedRoute>
                  <FindProfessionals />
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
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
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
            <Route
              path="/partnerships/:id"
              element={
                <ProtectedRoute>
                  <PartnershipDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partnerships/:id/apply"
              element={
                <ProtectedRoute>
                  <ApplyToPartnership />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
