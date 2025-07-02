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
import { useCreateContract } from "@/hooks/useContracts";
import { useEntities } from "@/hooks/useUsers";
import { FiPlus } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";

const createContractSchema = z.object({
  description: z.string().min(10, "Description must be at least 10 characters"),
  ownerId: z.number().min(1, "Please select an owner entity"),
  entityIds: z
    .array(z.number())
    .min(1, "Please select at least one participating entity"),
});

type CreateContractFormData = z.infer<typeof createContractSchema>;

export default function CreateContractDialog() {
  const [open, setOpen] = useState(false);
  const { data: entitiesData } = useEntities();
  const createContractMutation = useCreateContract();

  const form = useForm<CreateContractFormData>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      description: "",
      ownerId: 0,
      entityIds: [],
    },
  });

  const onSubmit = async (data: CreateContractFormData) => {
    try {
      await createContractMutation.mutateAsync({
        description: data.description,
        ownerId: data.ownerId,
        entityIds: data.entityIds,
      });
      setOpen(false);
      form.reset();
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
      form.setValue(
        "entityIds",
        currentIds.filter((id) => id !== entityId)
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          <FiPlus className="mr-2 h-4 w-4" />
          Create Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
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
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value?.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select the contract owner entity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entities.map((entity) => (
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
              name="entityIds"
              render={() => (
                <FormItem>
                  <FormLabel>Participating Entities *</FormLabel>
                  <div className="space-y-3">
                    {selectedEntityIds.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedEntityIds.map((entityId) => {
                          const entity = entities.find(
                            (e) => Number(e.id) === entityId
                          );
                          return entity ? (
                            <Badge
                              key={entityId}
                              variant="secondary"
                              className="text-sm"
                            >
                              {entity.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}
                    <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
                      <div className="space-y-2">
                        {entities.map((entity) => (
                          <div
                            key={entity.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`entity-${entity.id}`}
                              checked={selectedEntityIds.includes(
                                Number(entity.id)
                              )}
                              onCheckedChange={(checked) =>
                                handleEntityToggle(
                                  Number(entity.id),
                                  checked as boolean
                                )
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
                onClick={() => setOpen(false)}
                disabled={createContractMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createContractMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createContractMutation.isPending
                  ? "Creating..."
                  : "Create Contract"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
