
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './components/routing/AppRoutes';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <AppRoutes />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
