"use client";

import TopBar from "@/app/(pages)/components/top-bar";
import { AffiliatedTable } from "./components/affiliated-companies-table";
import AddNewAffiliatedCompaniesDialog from "../../components/add-new-affiliated-companies-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EntityService } from "../../../../../client";
import type { EntityResponse } from "../../../../../client";
import { toast } from "sonner";

export default function AffiliatedCompaniesPage() {
  const queryClient = useQueryClient();

  const { data: entitiesResponse, isLoading, error } = useQuery({
    queryKey: ['entities'],
    queryFn: () => EntityService.entityControllerFindMany(),
  });

  const deleteEntityMutation = useMutation({
    mutationFn: (id: number) => EntityService.entityControllerDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      toast.success('Company deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to delete company');
    },
  });

  const handleEdit = (entity: EntityResponse) => {
    // TODO: Implement edit functionality
    console.log('Edit entity:', entity);
  };

  const handleDelete = (entity: EntityResponse) => {
    if (window.confirm(`Are you sure you want to delete "${entity.name}"?`)) {
      deleteEntityMutation.mutate(Number(entity.id));
    }
  };

  const entities = entitiesResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <TopBar />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading companies...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <TopBar />
        <div className="flex-1 overflow-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">Error loading companies: {error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">
              Affiliated Companies
            </h1>
            <AddNewAffiliatedCompaniesDialog />
          </div>
        </div>

        <AffiliatedTable 
          data={entities} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
