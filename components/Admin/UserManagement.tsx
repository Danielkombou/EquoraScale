/**
 * User Management Component
 * Admin interface for managing users, roles, and permissions
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icons } from '../../constants';
import { UserProfile } from '../../services/auth';
import { useToast } from '../UI/Toast';
import { apiFetch } from '../../services/api';

interface UserListResponse {
  users: UserProfile[];
  total: number;
}

const UserManagement: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Fetch users from API
  const { data, isLoading, error, refetch } = useQuery<UserListResponse>({
    queryKey: ['admin-users', searchQuery, roleFilter],
    queryFn: async () => {
      const users = await getAllUsers();
      return {
        users,
        total: users.length,
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleCreateUser = () => {
    toast.info('User creation feature coming soon');
  };

  const handleEditUser = (userId: string) => {
    toast.info(`Edit user ${userId} - Feature coming soon`);
  };

  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete user');
    },
  });

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUserMutation.mutateAsync(parseInt(userId, 10));
      } catch (error) {
        // Error already handled by mutation
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      // TODO: Replace with actual API call
      // await apiFetch(`/admin/users/${userId}/role`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ role: newRole }),
      // });
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-rose-500 font-bold">Failed to load users</p>
          <p className="text-sm text-slate-500 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const filteredUsers = (data?.users || []).filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              User Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 sm:mt-2 text-xs sm:text-sm font-medium">
              Manage users, roles, and permissions
            </p>
          </div>
          <button
            onClick={handleCreateUser}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Icons.UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Create User</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Icons.Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                className="pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-4 sm:px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th className="px-4 sm:px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 sm:px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="px-4 sm:px-6 py-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-16 sm:py-20 text-center">
                      <div className="flex flex-col items-center">
                        <Icons.Users className="w-12 h-12 mb-4 text-slate-200 dark:text-slate-800" />
                        <p className="font-black uppercase tracking-[0.3em] text-xs text-slate-400 dark:text-slate-500 mb-2">
                          No Users Found
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {searchQuery || roleFilter !== 'all' 
                            ? 'Try adjusting your filters' 
                            : 'User management requires backend integration'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {user.username}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">
                              {user.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {user.email || '—'}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'user')}
                          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold uppercase focus:ring-2 focus:ring-indigo-500/20 outline-none cursor-pointer"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          user.is_active 
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' 
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Icons.Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Icons.Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <p>
            Showing <span className="font-bold">{filteredUsers.length}</span> of <span className="font-bold">{data?.total || 0}</span> users
          </p>
        </div>

      </div>
    </div>
  );
};

export default UserManagement;
