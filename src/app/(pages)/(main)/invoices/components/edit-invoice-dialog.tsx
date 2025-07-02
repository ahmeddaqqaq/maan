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
import { useUpdateInvoice } from "@/hooks/useInvoices";
import { useContracts } from "@/hooks/useContracts";
import { useClaims } from "@/hooks/useClaims";
import { useEntities } from "@/hooks/useUsers";

// Define proper types for the data objects
interface Invoice {
  id: number | string;
  startDate?: string;
  endDate?: string;
  contractId?: number;
  entityId?: number;
  claimIds?: number[];
}

interface Contract {
  id: number | string;
  description?: string;
  ownerId?: number;
  entityIds?: number[];
}

interface Claim {
  id: number | string;
  startDate?: string;
  endDate?: string;
  mineId?: number;
  entityId?: number;
  contractId?: number;
  requestId?: number;
  status?: string;
}

const editInvoiceSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  entityId: z.number().min(1, "Please select an entity"),
  contractId: z.number().optional(),
  claimIds: z.array(z.number()).min(1, "Please select at least one claim"),
});

type EditInvoiceFormData = z.infer<typeof editInvoiceSchema>;

interface EditInvoiceDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditInvoiceDialog({
  invoice,
  open,
  onOpenChange,
}: EditInvoiceDialogProps) {
  const { data: contractsData } = useContracts();
  const { data: claimsData } = useClaims();
  const { data: entitiesData } = useEntities();
  const updateInvoiceMutation = useUpdateInvoice();

  const form = useForm<EditInvoiceFormData>({
    resolver: zodResolver(editInvoiceSchema),
    defaultValues: {
      startDate: invoice.startDate?.split('T')[0] || "",
      endDate: invoice.endDate?.split('T')[0] || "",
      entityId: invoice.entityId || 0,
      contractId: invoice.contractId || undefined,
      claimIds: invoice.claimIds || [],
    },
  });

  const onSubmit = async (data: EditInvoiceFormData) => {
    try {
      await updateInvoiceMutation.mutateAsync({
        id: Number(invoice.id),
        data: {
          startDate: data.startDate,
          endDate: data.endDate,
          entityId: data.entityId,
          contractId: data.contractId,
          claimIds: data.claimIds,
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
          <DialogTitle>Edit Invoice</DialogTitle>
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
              name="contractId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract (Optional)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value === "none" ? undefined : Number(value))} value={field.value ? field.value.toString() : "none"}>
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
              name="entityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? field.value.toString() : ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an entity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entitiesData?.data?.map((entity) => (
                        <SelectItem key={entity.id} value={entity.id.toString()}>
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
              name="claimIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Claims *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      const claimId = Number(value);
                      const currentIds = field.value || [];
                      if (!currentIds.includes(claimId)) {
                        field.onChange([...currentIds, claimId]);
                      }
                    }} 
                    value=""
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select claims" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {claimsData?.data?.map((claim: Claim) => (
                        <SelectItem key={claim.id} value={claim.id.toString()}>
                          Claim #{claim.id} - {claim.startDate} to {claim.endDate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((claimId: number) => (
                        <div key={claimId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1">
                          Claim #{claimId}
                          <button
                            type="button"
                            onClick={() => field.onChange(field.value?.filter((id: number) => id !== claimId))}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateInvoiceMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateInvoiceMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateInvoiceMutation.isPending ? "Updating..." : "Update Invoice"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}