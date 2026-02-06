/**
 * Permission Hooks for RBAC
 * React hooks for checking user permissions and roles
 */

import { useContext } from 'react';
import { AuthContext } from '../App';
import {
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  isAdmin,
  getUserPermissions,
  canAccess,
} from '../utils/permissions';

/**
 * Hook to check if current user has a specific permission
 */
export const useHasPermission = (permission: Permission): boolean => {
  const { user } = useContext(AuthContext);
  return hasPermission(user, permission);
};

/**
 * Hook to check if current user has any of the specified permissions
 */
export const useHasAnyPermission = (permissions: Permission[]): boolean => {
  const { user } = useContext(AuthContext);
  return hasAnyPermission(user, permissions);
};

/**
 * Hook to check if current user has all of the specified permissions
 */
export const useHasAllPermissions = (permissions: Permission[]): boolean => {
  const { user } = useContext(AuthContext);
  return hasAllPermissions(user, permissions);
};

/**
 * Hook to check if current user has a specific role
 */
export const useHasRole = (role: string): boolean => {
  const { user } = useContext(AuthContext);
  return hasRole(user, role);
};

/**
 * Hook to check if current user is an admin
 */
export const useIsAdmin = (): boolean => {
  const { user } = useContext(AuthContext);
  return isAdmin(user);
};

/**
 * Hook to get all permissions for current user
 */
export const useUserPermissions = (): Permission[] => {
  const { user } = useContext(AuthContext);
  return getUserPermissions(user);
};

/**
 * Hook to check if current user can access a feature
 */
export const useCanAccess = (feature: string): boolean => {
  const { user } = useContext(AuthContext);
  return canAccess(user, feature);
};

/**
 * Hook to get current user
 */
export const useUser = () => {
  const { user } = useContext(AuthContext);
  return user;
};
