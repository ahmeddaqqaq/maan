"use client";

// This file is disabled due to missing RequestService and ClaimService
// All exports have been commented out to prevent build errors

// Placeholder to prevent import errors
export function useRequestsWithClaimBackend() {
  return { data: [], isLoading: false, error: null };
}

export function useCreateRequestWithClaimBackend() {
  return { mutate: () => {}, isLoading: false };
}

export function useUpdateRequestWithClaimBackend() {
  return { mutate: () => {}, isLoading: false };
}

export function useDeleteRequestWithClaimBackend() {
  return { mutate: () => {}, isLoading: false };
}