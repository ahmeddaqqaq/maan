"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useEntities } from "@/hooks/useUsers";
import { FiPlus } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MineService } from "../../../../client";
import type { CreateMineDto } from "../../../../client";
import { toast } from "sonner";

const createMineSchema = z.object({
  name: z.string().min(1, "Mine name is required"),
  location: z.string().min(1, "Location is required"),
  isActive: z.boolean(),
  entityId: z.number().min(1, "Please select an entity"),
});

type CreateMineFormData = z.infer<typeof createMineSchema>;

export default function AddNewWorkAreaDialog() {
  const [open, setOpen] = useState(false);
  const { data: entitiesData } = useEntities();
  const queryClient = useQueryClient();

  const createMineMutation = useMutation({
    mutationFn: async (data: CreateMineDto) => {
      return await MineService.mineControllerCreate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mines"] });
      toast.success("Mine created successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to create mine");
    },
  });

  const form = useForm<CreateMineFormData>({
    resolver: zodResolver(createMineSchema),
    defaultValues: {
      name: "",
      location: "",
      isActive: true,
      entityId: 0,
    },
  });

  const onSubmit = async (data: CreateMineFormData) => {
    await createMineMutation.mutateAsync({
      name: data.name,
      location: data.location,
      isActive: data.isActive,
      entityId: data.entityId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          <FiPlus className="mr-2 h-4 w-4" />
          Add Work Area
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add new work area</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work Area Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Northern Production Unit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
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
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an entity" />
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable or disable this work area
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createMineMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMineMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createMineMutation.isPending
                  ? "Creating..."
                  : "Create Work Area"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
