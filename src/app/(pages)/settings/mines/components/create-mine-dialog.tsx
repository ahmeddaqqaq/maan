"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ContractResponse,
  ContractService,
  CreateMineDto,
  MineService,
} from "../../../../../../client";

const createMineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contractId: z.number().min(1, "Contract ID is required"),
  location: z.string().optional(),
});

type CreateMineFormData = z.infer<typeof createMineSchema>;

interface CreateMineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMineDialog({
  open,
  onOpenChange,
}: CreateMineDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [contracts, setContracts] = useState<ContractResponse[]>([]);

  const form = useForm<CreateMineFormData>({
    resolver: zodResolver(createMineSchema),
    defaultValues: {
      name: "",
      contractId: 0,
      location: "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchContracts();
    }
  }, [open]);

  const fetchContracts = async () => {
    try {
      const response = await ContractService.contractControllerFindMany({});
      setContracts(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch contracts");
      console.error(error);
    }
  };

  const onSubmit = async (data: CreateMineFormData) => {
    setIsLoading(true);
    try {
      const createMineDto: CreateMineDto = {
        name: data.name,
        contractId: data.contractId,
        location: data.location || undefined,
      };

      await MineService.mineControllerCreate({
        requestBody: createMineDto,
      });

      toast.success("Mine created successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create mine");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Mine</DialogTitle>
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
                    <Input {...field} placeholder="Enter mine name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contracts.map((contract) => (
                        <SelectItem
                          key={contract.id}
                          value={contract.id.toString()}
                        >
                          {contract.name}
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter mine location" />
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
                {isLoading ? "Creating..." : "Create Mine"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
