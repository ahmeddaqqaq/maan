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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateContract } from "@/hooks/useContracts";
import { useEntities } from "@/hooks/useUsers";
import { Badge } from "@/components/ui/badge";

// Define a proper type for the contract object
interface Contract {
  id: number | string;
  description?: string;
  ownerId?: number;
  entityIds?: number[];
}

const editContractSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  ownerId: z.number().min(1, "Please select an owner entity"),
  entityIds: z.array(z.number()).min(1, "Please select at least one participating entity"),
});

type EditContractFormData = z.infer<typeof editContractSchema>;

interface EditContractDialogProps {
  contract: Contract;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditContractDialog({
  contract,
  open,
  onOpenChange,
}: EditContractDialogProps) {
  const { data: entitiesData } = useEntities();
  const updateContractMutation = useUpdateContract();

  const form = useForm<EditContractFormData>({
    resolver: zodResolver(editContractSchema),
    defaultValues: {
      description: contract.description || "",
      ownerId: contract.ownerId || 0,
      entityIds: contract.entityIds || [],
    },
  });

  const onSubmit = async (data: EditContractFormData) => {
    try {
      await updateContractMutation.mutateAsync({
        id: Number(contract.id),
        data: {
          description: data.description,
          ownerId: data.ownerId,
          entityIds: data.entityIds,
        },
      });
      onOpenChange(false);
    } catch {
      // Error handling is done in the mutation
    }
  };

  const entities = entitiesData?.data || [];
  const selectedEntityIds = form.watch("entityIds") || [];

  const handleEntityToggle = (entityId: number, checked: boolean) => {
    const currentIds = form.getValues("entityIds") || [];
    if (checked) {
      form.setValue("entityIds", [...currentIds, entityId]);
    } else {
      form.setValue("entityIds", currentIds.filter(id => id !== entityId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contract</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter detailed contract description..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Owner *</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the contract owner entity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entities.map((entity) => (
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
              name="entityIds"
              render={() => (
                <FormItem>
                  <FormLabel>Participating Entities *</FormLabel>
                  <div className="space-y-3">
                    {selectedEntityIds.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedEntityIds.map((entityId) => {
                          const entity = entities.find(e => Number(e.id) === entityId);
                          return entity ? (
                            <Badge key={entityId} variant="secondary" className="text-sm">
                              {entity.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                    <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
                      <div className="space-y-2">
                        {entities.map((entity) => (
                          <div key={entity.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`entity-${entity.id}`}
                              checked={selectedEntityIds.includes(Number(entity.id))}
                              onCheckedChange={(checked) => 
                                handleEntityToggle(Number(entity.id), checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={`entity-${entity.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {entity.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
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
                disabled={updateContractMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateContractMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateContractMutation.isPending ? "Updating..." : "Update Contract"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}