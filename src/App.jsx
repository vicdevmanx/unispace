import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./Pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import WorkspaceManagement from "./pages/admin/_pages/WorkspaceManagement";
import RequireAuth from "./contexts/RequireAuth";
import RequireAdmin from "./contexts/RequireAdmin";
import RedirectIfAuth from "./contexts/RedirectIfAuth";
import AdminLogin from "./pages/admin/_pages/_auth/AdminLogin";
import WorkspaceLogin from './pages/workspace/_pages/_auth/WorkspaceLogin';
import WorkspaceDashboard from './pages/workspace/WorkspaceDashboard';
import WorkspaceServicesPage from './pages/workspace/_pages/WorkspaceServicesPage';
import { WorkspacePortalProvider } from './contexts/WorkspacePortalContext';
import WorkspaceRegister from './pages/workspace/_pages/_auth/WorkspaceRegister';
import RequireWorkspace from './contexts/RequireWorkspace';
import WorkspaceService from "./Pages/workspace-service/pages/workspace-service";

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <WorkspaceProvider>
          <WorkspacePortalProvider>
            <Router>
              <Routes>
                {/* Public Routea */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth Routes */}
                <Route
                  path="/register"
                  element={
                    <RedirectIfAuth>
                      <Register />
                    </RedirectIfAuth>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <RedirectIfAuth>
                      <Login />
                    </RedirectIfAuth>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <RedirectIfAuth>
                      <ForgotPassword />
                    </RedirectIfAuth>
                  }
                />

                {/* Workspace Portal Routes */}
                <Route path="/workspace/login" element={<WorkspaceLogin />} />
                <Route path="/workspace/register" element={<WorkspaceRegister />} />
                <Route
                  path="/workspace/dashboard"
                  element={
                    <RequireWorkspace>
                      <WorkspaceDashboard />
                    </RequireWorkspace>
                  }
                />
                <Route
                  path="/workspace/services"
                  element={
                    <RequireWorkspace>
                      <WorkspaceServicesPage />
                    </RequireWorkspace>
                  }
                />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <RequireAuth>
                      <RequireAdmin>
                        <AdminDashboard />
                      </RequireAdmin>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/admin/workspaces"
                  element={
                    <RequireAuth>
                      <RequireAdmin>
                        <WorkspaceManagement />
                      </RequireAdmin>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/workspace-service"
                  element={
                      <WorkspaceService />
                  }
                />
              </Routes>
            </Router>
          </WorkspacePortalProvider>
        </WorkspaceProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
