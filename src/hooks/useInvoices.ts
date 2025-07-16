"use client";

// This file is disabled due to missing InvoiceService
// All exports have been commented out to prevent build errors

// Placeholder to prevent import errors
export function useInvoices() {
  return { data: [], isLoading: false, error: null };
}

export function useInvoice() {
  return { data: null, isLoading: false, error: null };
}

export function useCreateInvoice() {
  return { mutate: () => {}, isLoading: false };
}

export function useUpdateInvoice() {
  return { mutate: () => {}, isLoading: false };
}

export function useDeleteInvoice() {
  return { mutate: () => {}, isLoading: false };
}