import { User } from '../types';
import { apiFetch, setAuthToken } from './api';

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
