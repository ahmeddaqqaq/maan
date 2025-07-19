"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CreateEntityDto, EntityService } from "../../../../../../client";

const createEntitySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type CreateEntityFormData = z.infer<typeof createEntitySchema>;

interface CreateEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEntityCreated?: () => void;
}

export function CreateEntityDialog({
  open,
  onOpenChange,
  onEntityCreated,
}: CreateEntityDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateEntityFormData>({
    resolver: zodResolver(createEntitySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateEntityFormData) => {
    setIsLoading(true);
    try {
      const createEntityDto: CreateEntityDto = {
        name: data.name,
      };

      await EntityService.entityControllerCreate({
        requestBody: createEntityDto,
      });

      toast.success("Entity created successfully");
      form.reset();
      onOpenChange(false);
      onEntityCreated?.();
    } catch (error) {
      toast.error("Failed to create entity");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Entity</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter entity name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Entity"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}