import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "./AuthContext";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { user, loading } = useAuthContext();
  const location = useLocation();

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
            stroke="#e0e0e0"
            fill="none"
            strokeWidth="5"
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
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

export default RequireAuth;
