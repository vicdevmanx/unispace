import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "./Pages/LandingPage";
import Register from "./Pages/auth/Register";
import Login from "./Pages/auth/Login";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import WorkspaceManagement from "./Pages/admin/_pages/WorkspaceManagement";
import RequireAuth from "./contexts/RequireAuth";
import RequireAdmin from "./contexts/RequireAdmin";
import RedirectIfAuth from "./contexts/RedirectIfAuth";
import AdminLogin from "./Pages/admin/_pages/_auth/AdminLogin";
import WorkspaceLogin from './Pages/workspace/_pages/_auth/WorkspaceLogin';
import WorkspaceDashboard from './Pages/workspace/WorkspaceDashboard';
import WorkspaceServicesPage from './Pages/workspace/_pages/WorkspaceServicesPage';
import { WorkspacePortalProvider } from './contexts/WorkspacePortalContext';
import WorkspaceRegister from './Pages/workspace/_pages/_auth/WorkspaceRegister';
import RequireWorkspace from './contexts/RequireWorkspace';
import WorkspaceDiscountsPage from './Pages/workspace/_pages/WorkspaceDiscountsPage';
import WorkspaceProfile from './Pages/workspace/_pages/WorkspaceProfile';
import UserHome from './Pages/main/_pages/UserHome';
import RewardsPage from './Pages/main/_pages/RewardsPage';
import UserProfilePage from './Pages/main/_pages/UserProfilePage';
// import WorkspaceServicePage from './Pages/main/_pages/services/SpaceServicePage';
import WorkspaceCashtokenTransactions from "./Pages/workspace/_pages/WorkspaceCashtokenTransactions";
import WorkspaceTransactionsPage from "./Pages/workspace/_pages/WorkspaceTransactionsPage";
import UserBookingHistory from './Pages/main/_pages/history/UserBookingHistory';
import RequireUser from "./contexts/RequireUser";
import SpaceServicePage from "./Pages/main/_pages/services/SpaceServicePage";
import WorkspaceBookingsPage from "./Pages/workspace/_pages/WorkspaceBookingsPage";
import UserTransactionsPage from "./Pages/main/_pages/UserTransactionsPage";
// import NotFound from "./Pages/NotFound";

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
