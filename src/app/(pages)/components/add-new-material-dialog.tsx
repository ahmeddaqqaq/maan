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
import { useMines } from "@/hooks/useClaims";
import { FiPlus } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MaterialService } from "../../../../client";
import type { CreateMaterialDto } from "../../../../client";
import { toast } from "sonner";

const createMaterialSchema = z.object({
  name: z.string().min(1, "Material name is required"),
  unit: z.string().min(1, "Unit is required"),
  isActive: z.boolean(),
  entityId: z.number().min(1, "Please select an entity"),
  mineId: z.number().optional(),
});

type CreateMaterialFormData = z.infer<typeof createMaterialSchema>;

export default function AddNewMaterialDialog() {
  const [open, setOpen] = useState(false);
  const { data: entitiesData } = useEntities();
  const { data: minesData } = useMines();
  const queryClient = useQueryClient();

  const createMaterialMutation = useMutation({
    mutationFn: async (data: CreateMaterialDto) => {
      return await MaterialService.materialControllerCreate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material created successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Failed to create material");
    },
  });

  const form = useForm<CreateMaterialFormData>({
    resolver: zodResolver(createMaterialSchema),
    defaultValues: {
      name: "",
      unit: "",
      isActive: true,
      entityId: 0,
      mineId: undefined,
    },
  });

  const onSubmit = async (data: CreateMaterialFormData) => {
    await createMaterialMutation.mutateAsync({
      name: data.name,
      unit: data.unit,
      isActive: data.isActive,
      entityId: data.entityId,
      mineId: data.mineId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          <FiPlus className="mr-2 h-4 w-4" />
          Add Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Material</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter material name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                      <SelectItem value="cubic_meters">
                        Cubic Meters (m³)
                      </SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="units">Units</SelectItem>
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
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value?.toString() : ""}
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
              name="mineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mine (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : undefined)
                    }
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a mine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No Mine</SelectItem>
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable or disable this material
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
                disabled={createMaterialMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMaterialMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createMaterialMutation.isPending
                  ? "Creating..."
                  : "Create Material"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
