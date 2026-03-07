import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  /*
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && !allowedRoles.includes(user.role)) {
    const roleRoutes: Record<UserRole, string> = { ADMIN: '/admin', EMPLOYEE: '/employee', CITIZEN: '/citizen' };
    return <Navigate to={roleRoutes[user.role]} replace />;
  }
  */
  return <div>{children}</div>;
};

export default ProtectedRoute;
