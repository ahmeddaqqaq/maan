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
import { FiPlus } from "react-icons/fi";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EntityService } from '../../../../client';
import type { CreateEntityDto } from '../../../../client';
import { toast } from 'sonner';

const createEntitySchema = z.object({
  name: z.string().min(1, "Company name is required"),
});

type CreateEntityFormData = z.infer<typeof createEntitySchema>;

export default function AddNewAffiliatedCompaniesDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const createEntityMutation = useMutation({
    mutationFn: async (data: CreateEntityDto) => {
      return await EntityService.entityControllerCreate(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      toast.success('Company created successfully');
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error?.message || 'Failed to create company');
    },
  });

  const form = useForm<CreateEntityFormData>({
    resolver: zodResolver(createEntitySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateEntityFormData) => {
    await createEntityMutation.mutateAsync({
      name: data.name,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
          <FiPlus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add New Affiliated Company</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createEntityMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createEntityMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createEntityMutation.isPending ? "Creating..." : "Create Company"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
