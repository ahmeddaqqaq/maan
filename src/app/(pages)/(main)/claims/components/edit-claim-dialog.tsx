"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateClaim, useMines } from "@/hooks/useClaims";
import { useEntities } from "@/hooks/useUsers";
import { useContracts } from "@/hooks/useContracts";
import { useRequests } from "@/hooks/useRequests";

// Define proper types for the data objects
interface Claim {
  id: number | string;
  startDate?: string;
  endDate?: string;
  mineId?: number;
  entityId?: number;
  contractId?: number;
  requestId?: number;
}

interface Contract {
  id: number | string;
  description?: string;
  ownerId?: number;
  entityIds?: number[];
}

interface Request {
  id: number | string;
  description?: string;
  requestingEntityId?: number;
  targetEntityId?: number;
  contractId?: number;
  mineId?: number;
  materialId?: number;
  startDate?: string;
  endDate?: string;
}

const editClaimSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  mineId: z.number().min(1, "Please select a mine"),
  entityId: z.number().min(1, "Please select an entity"),
  contractId: z.number().optional(),
  requestId: z.number().optional(),
});

type EditClaimFormData = z.infer<typeof editClaimSchema>;

interface EditClaimDialogProps {
  claim: Claim;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditClaimDialog({
  claim,
  open,
  onOpenChange,
}: EditClaimDialogProps) {
  const { data: minesData } = useMines();
  const { data: entitiesData } = useEntities();
  const { data: contractsData } = useContracts();
  const { data: requestsData } = useRequests();
  const updateClaimMutation = useUpdateClaim();

  const form = useForm<EditClaimFormData>({
    resolver: zodResolver(editClaimSchema),
    defaultValues: {
      startDate: claim.startDate?.split('T')[0] || "",
      endDate: claim.endDate?.split('T')[0] || "",
      mineId: claim.mineId || 0,
      entityId: claim.entityId || 0,
      contractId: claim.contractId || undefined,
      requestId: claim.requestId || undefined,
    },
  });

  const onSubmit = async (data: EditClaimFormData) => {
    try {
      await updateClaimMutation.mutateAsync({
        id: Number(claim.id),
        data: {
          startDate: data.startDate,
          endDate: data.endDate,
          mineId: data.mineId,
          entityId: data.entityId,
          contractId: data.contractId,
          requestId: data.requestId,
        },
      });
      onOpenChange(false);
    } catch {
      // Error handling is done in the mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Claim</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="mineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mine *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a mine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {minesData?.data?.map((mine) => (
                        <SelectItem key={mine.id} value={mine.id.toString()}>
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
              name="entityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an entity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entitiesData?.data?.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id}>
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
              name="contractId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract (Optional)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value ? Number(value) : undefined)} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contract" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Contract</SelectItem>
                      {contractsData?.data?.map((contract: Contract) => (
                        <SelectItem key={contract.id} value={contract.id?.toString() || ""}>
                          Contract #{contract.id} - {contract.description || 'No description'}
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
              name="requestId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request (Optional)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value ? Number(value) : undefined)} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a request" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Request</SelectItem>
                      {requestsData?.data?.map((request: Request) => (
                        <SelectItem key={request.id} value={request.id.toString()}>
                          Request #{request.id} - {request.description || "No description"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateClaimMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateClaimMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateClaimMutation.isPending ? "Updating..." : "Update Claim"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}