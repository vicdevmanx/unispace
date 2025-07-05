import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
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
import WorkspaceDiscountsPage from './pages/workspace/_pages/WorkspaceDiscountsPage';
import WorkspaceProfile from './pages/workspace/_pages/WorkspaceProfile';
import UserHome from './pages/main/_pages/UserHome';
import RewardsPage from './pages/main/_pages/RewardsPage';
import UserProfilePage from './pages/main/_pages/UserProfilePage';
import WorkspaceServicePage from './pages/main/_pages/services/SpaceServicePage';
import WorkspaceCashtokenTransactions from "./pages/workspace/_pages/WorkspaceCashtokenTransactions";
import WorkspaceTransactionsPage from "./pages/workspace/_pages/WorkspaceTransactionsPage";
import UserBookingHistory from './pages/main/_pages/history/UserBookingHistory';
import RequireUser from "./contexts/RequireUser";
import SpaceServicePage from "./pages/main/_pages/services/SpaceServicePage";
import WorkspaceBookingsPage from "./pages/workspace/_pages/WorkspaceBookingsPage";
import UserTransactionsPage from "./pages/main/_pages/UserTransactionsPage";
// import NotFound from "./pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <WorkspaceProvider>
          <WorkspacePortalProvider>
            <Router>
              <Toaster 
                position="top-right"
                richColors
                closeButton
                duration={4000}
              />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<RedirectIfAuth><LandingPage /></RedirectIfAuth>} />
                {/* <Route path="*" element={<NotFound />} /> */}
                
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

                {/* User Routes */}
                <Route
                  path="/user-home"
                  element={
                    <RequireUser>
                      <UserHome />
                    </RequireUser>
                  }
                />
                <Route
                  path="/rewards"
                  element={
                    <RequireUser>
                      <RewardsPage />
                    </RequireUser>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <RequireUser>
                      <UserProfilePage />
                    </RequireUser>
                  }
                />
                <Route
                  path="/space/service"
                  element={
                    // <RequireUser>
                      <SpaceServicePage />
                    // </RequireUser>
                  }
                />
                 <Route
                  path="/space/transactions"
                  element={
                    // <RequireUser>
                      <UserTransactionsPage />
                    // </RequireUser>
                  }
                />
                <Route
                  path="/space/history"
                  element={
                    // <RequireUser>
                      <UserBookingHistory />
                    // </RequireUser>
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
                  path="/workspace/discounts"
                  element={
                    <RequireWorkspace>
                      <WorkspaceDiscountsPage />
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
                <Route
                  path="/workspace/profile"
                  element={
                    <RequireWorkspace>
                      <WorkspaceProfile />
                    </RequireWorkspace>
                  }
                />
                <Route
                  path="/workspace/cashtoken-transactions"
                  element={
                    <RequireWorkspace>
                      <WorkspaceCashtokenTransactions />
                    </RequireWorkspace>
                  }
                />
                <Route
                  path="/workspace/transactions"
                  element={
                    <RequireWorkspace>
                      <WorkspaceTransactionsPage />
                    </RequireWorkspace>
                  }
                />
                 <Route
                  path="/workspace/bookings"
                  element={
                    <RequireWorkspace>
                      <WorkspaceBookingsPage />
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
              </Routes>
            </Router>
          </WorkspacePortalProvider>
        </WorkspaceProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
