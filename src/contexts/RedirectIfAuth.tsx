import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

interface RedirectIfAuthProps {
  children: React.ReactNode;
}

const RedirectIfAuth: React.FC<RedirectIfAuthProps> = ({ children }) => {
  const { user, loading } = useAuthContext();
  // console.log('RedirectIfAuth user:', user);
  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <svg
          className="animate-spin"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="#ffffff"
            fill="none"
            strokeWidth="6"
          />
          <path
            fill="none"
            stroke="#1d3a8a"
            strokeWidth="5"
            strokeLinecap="round"
            d="M25 5
           a20 20 0 0 1 0 40
           a20 20 0 0 1 0 -40"
          />
        </svg>
      </div>
    );
  if (user) {
    if (user.userType === "normal") return <Navigate to="/user-home" replace />;
    if (user.userType === "workspace")
      return <Navigate to="/workspace/dashboard" replace />;
    if (user.userType === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default RedirectIfAuth;
