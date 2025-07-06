"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from 'next-intl';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateClaim } from "@/hooks/useClaims";
import { useEntities } from "@/hooks/useUsers";
import { useContracts } from "@/hooks/useContracts";
import { useMines } from "@/hooks/useClaims";
import { FiPlus } from "react-icons/fi";
import type { CreateClaimDto } from "../../../../../../client";

interface Entity {
  id: number | string;
  name: string;
}

interface Contract {
  id: number | string;
  description?: string;
  ownerId?: number;
  entityIds?: number[];
}


interface Mine {
  id: number | string;
  name: string;
  location: string;
  isActive: boolean;
}

const createClaimSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  mineId: z.number().min(1, "Please select a mine"),
  entityId: z.number().min(1, "Please select an entity"),
  contractId: z.number().optional(),
  requestId: z.number().optional(),
});

type CreateClaimFormData = z.infer<typeof createClaimSchema>;

export default function CreateClaimDialog() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const { data: entitiesData } = useEntities();
  const { data: contractsData } = useContracts();
  const { data: minesData } = useMines();
  const createClaimMutation = useCreateClaim();

  const form = useForm<CreateClaimFormData>({
    resolver: zodResolver(createClaimSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      status: "PENDING",
      mineId: 0,
      entityId: 0,
      contractId: undefined,
      requestId: undefined,
    },
  });

  const onSubmit = async (data: CreateClaimFormData) => {
    try {
      const createData: CreateClaimDto = {
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status as CreateClaimDto.status,
        mineId: data.mineId,
        entityId: data.entityId,
        contractId: data.contractId,
        requestId: data.requestId,
      };
      await createClaimMutation.mutateAsync(createData);
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
          <FiPlus className="me-2 h-4 w-4" />
          {t('claims.create')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('claims.createNew')}</DialogTitle>
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value as "PENDING" | "APPROVED" | "REJECTED")}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
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
                    <FormLabel>Mine *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value?.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select mine" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {minesData?.data?.map((mine: Mine) => (
                          <SelectItem key={mine.id} value={String(mine.id)}>
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
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value?.toString() : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select entity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {entitiesData?.data?.map((entity: Entity) => (
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

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createClaimMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createClaimMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createClaimMutation.isPending ? "Creating..." : "Create Claim"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}