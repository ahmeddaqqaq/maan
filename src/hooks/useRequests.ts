"use client";

// This file is disabled due to missing RequestService
// All exports have been commented out to prevent build errors

// Placeholder to prevent import errors
export function useRequests() {
  return { data: [], isLoading: false, error: null };
}

export function useRequest() {
  return { data: null, isLoading: false, error: null };
}

export function useCreateRequest() {
  return { mutate: () => {}, isLoading: false };
}

export function useUpdateRequest() {
  return { mutate: () => {}, isLoading: false };
}

export function useDeleteRequest() {
  return { mutate: () => {}, isLoading: false };
}