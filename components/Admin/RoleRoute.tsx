/**
 * Role-based Route Guard
 * Protects routes that require specific roles
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../App';
import { hasRole } from '../../utils/permissions';
import AccessDenied from './AccessDenied';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasAccess = allowedRoles.some(role => hasRole(user, role));

  if (!hasAccess) {
    return <AccessDenied requiredRole={allowedRoles.join(' or ')} />;
  }

  return <>{children}</>;
};

export default RoleRoute;
