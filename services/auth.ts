import { User } from '../types';
import { apiFetch, setAuthToken } from './api';
import { isAdmin, hasRole, hasPermission, Permission } from '../utils/permissions';

type LoginResponse = {
  message: string;
  access_token: string;
  user: any;
};

export type UserProfile = {
  id: string;
  username: string;
  role: User['role'];
  email?: string | null;
  is_active?: boolean;
  metadata?: Record<string, any> | null;
  created_at?: string;
  updated_at?: string;
};

const mapUser = (u: any): User => ({
  id: String(u.id ?? u.sub ?? ''),
  username: u.username,
  role: (u.role || 'user') as User['role'],
});

export const loginUser = async (usernameOrEmail: string, password: string) => {
  const data = await apiFetch<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usernameOrEmail, password }),
  });

  if (data?.access_token) {
    setAuthToken(data.access_token);
  }

  return mapUser(data.user);
};

export const getProfile = async () => {
  const data = await apiFetch<any>('/users/profile', {
    method: 'GET',
  });
  return mapUser(data);
};

export const getProfileDetails = async (): Promise<UserProfile> => {
  const data = await apiFetch<any>('/users/profile', {
    method: 'GET',
  });
  return {
    id: String(data.id ?? data.sub ?? ''),
    username: data.username,
    role: (data.role || 'user') as User['role'],
    email: data.email ?? null,
    is_active: typeof data.is_active === 'boolean' ? data.is_active : undefined,
    metadata: data.metadata ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
};

export const logoutUser = () => {
  setAuthToken(null);
};

export type RegisterUserDto = {
  username: string;
  email: string;
  password: string;
  metadata?: Record<string, any>;
  role?: 'admin' | 'user';
  secretKey: string;
};

type RegisterResponse = {
  message: string;
  user: any;
};

export const registerUser = async (registerDto: RegisterUserDto) => {
  const data = await apiFetch<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: registerDto,
  });

  return mapUser(data.user);
};

/**
 * Role validation helpers
 */
export const validateUserRole = (user: User | null, requiredRole: string): boolean => {
  return hasRole(user, requiredRole);
};

export const validateUserIsAdmin = (user: User | null): boolean => {
  return isAdmin(user);
};

export const validateUserPermission = (user: User | null, permission: Permission): boolean => {
  return hasPermission(user, permission);
};

/**
 * Check if user can perform an action
 */
export const canUserPerformAction = (user: User | null, action: string): boolean => {
  if (!user) return false;
  
  const actionPermissions: Record<string, Permission> = {
    'delete-document': Permission.DELETE_DOCUMENTS,
    'upload-document': Permission.UPLOAD_DOCUMENTS,
    'edit-document': Permission.EDIT_DOCUMENTS,
    'manage-users': Permission.MANAGE_USER_ROLES,
    'view-analytics': Permission.VIEW_ANALYTICS,
    'reset-database': Permission.RESET_DATABASE,
  };
  
  const requiredPermission = actionPermissions[action];
  if (!requiredPermission) return false;
  
  return hasPermission(user, requiredPermission);
};
