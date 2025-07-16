"use client";

// This file is disabled due to missing RequestService and ClaimService
// All exports have been commented out to prevent build errors

// Placeholder to prevent import errors
export function useClaimsWithRequestBackend() {
  return { data: [], isLoading: false, error: null };
}

export function useCreateClaimWithRequestBackend() {
  return { mutate: () => {}, isLoading: false };
}

export function useUpdateClaimWithRequestBackend() {
  return { mutate: () => {}, isLoading: false };
}

export function useDeleteClaimWithRequestBackend() {
  return { mutate: () => {}, isLoading: false };
}

export function useApproveRejectClaimWithRequestBackend() {
  return { mutate: () => {}, isLoading: false };
}