import { useAuthContext } from './AuthContext';
import { Navigate } from 'react-router-dom';

export default function RequireUser({ children }) {
  const { user } = useAuthContext();
  // console.log('RequireUser user:', user);
  // Only allow access if user.userType is 'normal'
  if (!user || user.userType !== 'normal') {
    return <Navigate to="/" replace />;
  }
  return children;
} 