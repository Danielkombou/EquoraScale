import { apiFetch } from './api';
import { UserProfile } from './auth';

export interface UserListResponse {
  users: UserProfile[];
  total: number;
}

// Get all users (admin only)
export const getAllUsers = async (): Promise<UserProfile[]> => {
  return apiFetch<UserProfile[]>('/users/all', {
    method: 'GET',
  });
};

// Delete user (admin only)
export const deleteUser = async (id: number): Promise<{ message: string }> => {
  return apiFetch<{ message: string }>(`/users/${id}`, {
    method: 'DELETE',
  });
};
