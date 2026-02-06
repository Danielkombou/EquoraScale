/**
 * Permission System for EquoraScale RBAC
 * Defines permissions and role-based access control
 */

import { User } from '../types';

export enum Permission {
  // Document Permissions
  VIEW_DOCUMENTS = 'view:documents',
  UPLOAD_DOCUMENTS = 'upload:documents',
  DELETE_DOCUMENTS = 'delete:documents',
  EDIT_DOCUMENTS = 'edit:documents',
  ANALYZE_DOCUMENTS = 'analyze:documents',
  
  // User Management Permissions
  VIEW_USERS = 'view:users',
  CREATE_USERS = 'create:users',
  EDIT_USERS = 'edit:users',
  DELETE_USERS = 'delete:users',
  MANAGE_USER_ROLES = 'manage:user:roles',
  
  // System Permissions
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_SETTINGS = 'manage:settings',
  VIEW_SYSTEM_LOGS = 'view:system:logs',
  MANAGE_API_KEYS = 'manage:api:keys',
  RESET_DATABASE = 'reset:database',
  
  // Collection Permissions
  VIEW_COLLECTIONS = 'view:collections',
  MANAGE_COLLECTIONS = 'manage:collections',
}

// Role to Permissions mapping
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    // Documents - Full access
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.DELETE_DOCUMENTS,
    Permission.EDIT_DOCUMENTS,
    Permission.ANALYZE_DOCUMENTS,
    
    // User Management - Full access
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.EDIT_USERS,
    Permission.DELETE_USERS,
    Permission.MANAGE_USER_ROLES,
    
    // System - Full access
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_SYSTEM_LOGS,
    Permission.MANAGE_API_KEYS,
    Permission.RESET_DATABASE,
    
    // Collections - Full access
    Permission.VIEW_COLLECTIONS,
    Permission.MANAGE_COLLECTIONS,
  ],
  user: [
    // Documents - Limited access
    Permission.VIEW_DOCUMENTS,
    Permission.UPLOAD_DOCUMENTS,
    Permission.ANALYZE_DOCUMENTS,
    
    // Collections - View only
    Permission.VIEW_COLLECTIONS,
  ],
};

/**
 * Check if a user has a specific permission
 */
export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
};

/**
 * Check if a user has any of the specified permissions
 */
export const hasAnyPermission = (user: User | null, permissions: Permission[]): boolean => {
  if (!user) return false;
  return permissions.some(permission => hasPermission(user, permission));
};

/**
 * Check if a user has all of the specified permissions
 */
export const hasAllPermissions = (user: User | null, permissions: Permission[]): boolean => {
  if (!user) return false;
  return permissions.every(permission => hasPermission(user, permission));
};

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, role: string): boolean => {
  return user?.role === role;
};

/**
 * Check if user is admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'admin');
};

/**
 * Get all permissions for a user
 */
export const getUserPermissions = (user: User | null): Permission[] => {
  if (!user) return [];
  return ROLE_PERMISSIONS[user.role] || [];
};

/**
 * Check if user can access a feature
 */
export const canAccess = (user: User | null, feature: string): boolean => {
  if (!user) return false;
  
  // Feature to permission mapping
  const featurePermissions: Record<string, Permission[]> = {
    'analytics': [Permission.VIEW_ANALYTICS],
    'user-management': [Permission.VIEW_USERS],
    'settings': [Permission.MANAGE_SETTINGS],
    'collections': [Permission.VIEW_COLLECTIONS],
    'admin-panel': [Permission.MANAGE_SETTINGS],
  };
  
  const requiredPermissions = featurePermissions[feature] || [];
  if (requiredPermissions.length === 0) return true; // No restrictions
  
  return hasAnyPermission(user, requiredPermissions);
};
