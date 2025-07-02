"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, EntityService } from '../../client';
import type { UserResponse, CreateUserDto, UpdateUserDto, UserFindManyResponse } from '../../client';
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
      return await UserService.userControllerFindMany(
        filters?.skip,
        filters?.take,
        filters?.search
      );
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

// Hook for fetching entities for user assignment
export function useEntities() {
  return useQuery({
    queryKey: ['entities'],
    queryFn: async () => {
      return await EntityService.entityControllerFindMany();
    },
  });
}