"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, EntityService, AuthService } from '../../client';
import type { UserResponse, CreateUserDto, UpdateUserDto, UserFindManyResponse, ResetPasswordDto } from '../../client';
import { toast } from 'sonner';

interface UseUsersFilters {
  skip?: number;
  take?: number;
  search?: string;
  roleFilter?: string;
  statusFilter?: string;
  entityFilter?: string;
}

export function useUsers(filters?: UseUsersFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async (): Promise<UserFindManyResponse> => {
      console.log('🚀 Calling UserService.userControllerFindMany with filters:', filters);
      try {
        const result = await UserService.userControllerFindMany(
          filters?.skip,
          filters?.take,
          filters?.search
        );
        console.log('✅ UserService response:', result);
        return result;
      } catch (error) {
        console.error('❌ UserService error:', error);
        throw error;
      }
    },
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async (): Promise<UserResponse> => {
      return await UserService.userControllerFindOne(id);
    },
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      return await UserService.userControllerCreate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to create user');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserDto }) => {
      return await UserService.userControllerUpdate(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to update user');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await UserService.userControllerDelete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to delete user');
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ResetPasswordDto) => {
      return await AuthService.authControllerResetPassword(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Password reset successfully');
    },
    onError: (error: Error) => {
      const apiError = error as {body?: {error?: string}; message?: string};
      toast.error(apiError?.body?.error || apiError?.message || 'Failed to reset password');
    },
  });
}

// Hook for fetching entities for user assignment
export function useEntities() {
  return useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      return await EntityService.entityControllerFindMany();
    },
  });
}