"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateRequestWithClaimBackend } from "@/hooks/useRequestsWithClaimBackend";
import { useEntities } from "@/hooks/useUsers";
import { useContracts, useMaterials } from "@/hooks/useContracts";
import { useMines } from "@/hooks/useClaims";
import { FiPlus } from "react-icons/fi";

interface Contract {
  id: number | string;
  description?: string;
  ownerId?: number;
  entityIds?: number[];
}

interface Material {
  id: number | string;
  name: string;
  unit: string;
  isActive: boolean;
}

interface Mine {
  id: number | string;
  name: string;
  location: string;
  isActive: boolean;
}

const createRequestSchema = z.object({
  description: z.string().optional(),
  requestingEntityId: z.number().min(1, "Please select a requesting entity"),
  targetEntityId: z.number().min(1, "Please select a target entity"),
  contractId: z.number().optional(),
  mineId: z.number().optional(),
  materialId: z.number().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

type CreateRequestFormData = z.infer<typeof createRequestSchema>;

export default function CreateRequestDialog() {
  const [open, setOpen] = useState(false);
  const { data: entitiesData } = useEntities();
  const { data: contractsData } = useContracts();
  const { data: materialsData } = useMaterials();
  const { data: minesData } = useMines();
  // Using claim backend for requests frontend
  const createRequestMutation = useCreateRequestWithClaimBackend();

  const form = useForm<CreateRequestFormData>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      description: "",
      requestingEntityId: 0,
      targetEntityId: 0,
      contractId: undefined,
      mineId: undefined,
      materialId: undefined,
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (data: CreateRequestFormData) => {
    try {
      // Data conversion is handled in the hook
      await createRequestMutation.mutateAsync({
        description: data.description,
        requestingEntityId: data.requestingEntityId,
        targetEntityId: data.targetEntityId,
        contractId: data.contractId,
        mineId: data.mineId,
        materialId: data.materialId,
        startDate: data.startDate,
        endDate: data.endDate,
      });
      setOpen(false);
      form.reset();
    } catch {
      // Error handling is done in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          <FiPlus className="mr-2 h-4 w-4" />
          Create Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Request</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the request..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requestingEntityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Requesting Entity *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value?.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select requesting entity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {entitiesData?.data?.map((entity) => (
                          <SelectItem key={entity.id} value={String(entity.id)}>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetEntityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Entity *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value?.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select target entity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {entitiesData?.data?.map((entity) => (
                          <SelectItem key={entity.id} value={String(entity.id)}>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contractId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(
                        value === "none" ? undefined : Number(value)
                      )
                    }
                    value={field.value?.toString() || "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a contract" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Contract</SelectItem>
                      {contractsData?.data?.map((contract: Contract) => (
                        <SelectItem
                          key={contract.id}
                          value={contract.id?.toString() || ""}
                        >
                          Contract #{contract.id} -{" "}
                          {contract.description || "No description"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mineId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mine (Optional)</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(
                          value === "none" ? undefined : Number(value)
                        )
                      }
                      value={field.value?.toString() || "none"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a mine" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Mine</SelectItem>
                        {minesData?.data?.map((mine: Mine) => (
                          <SelectItem
                            key={mine.id}
                            value={mine.id.toString()}
                          >
                            {mine.name} - {mine.location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="materialId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material (Optional)</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(
                          value === "none" ? undefined : Number(value)
                        )
                      }
                      value={field.value?.toString() || "none"}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a material" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">No Material</SelectItem>
                        {materialsData?.data?.map((material: Material) => (
                          <SelectItem
                            key={material.id}
                            value={material.id.toString()}
                          >
                            {material.name} ({material.unit})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createRequestMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createRequestMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createRequestMutation.isPending ? "Creating..." : "Create Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}