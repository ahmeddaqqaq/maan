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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateInvoice } from "@/hooks/useInvoices";
import { useContracts } from "@/hooks/useContracts";
import { useClaims } from "@/hooks/useClaims";
import { useEntities } from "@/hooks/useUsers";
import { FiPlus } from "react-icons/fi";
import { useTranslations } from "next-intl";

// Define interfaces for the data objects
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

export default function CreateInvoiceDialog() {
  const [open, setOpen] = useState(false);
  const { data: contractsData } = useContracts();
  const { data: claimsData } = useClaims();
  const { data: entitiesData } = useEntities();
  const createInvoiceMutation = useCreateInvoice();
  const t = useTranslations();

  const createInvoiceSchema = z.object({
    startDate: z.string().min(1, t("dialogs.createInvoice.validation.startDateRequired")),
    endDate: z.string().min(1, t("dialogs.createInvoice.validation.endDateRequired")),
    entityId: z.number().min(1, t("dialogs.createInvoice.validation.entityRequired")),
    contractId: z.number().optional(),
    claimIds: z.array(z.number()).min(1, t("dialogs.createInvoice.validation.claimsRequired")),
  });

  type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

  const form = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      entityId: 0,
      contractId: undefined,
      claimIds: [],
    },
  });

  const onSubmit = async (data: CreateInvoiceFormData) => {
    try {
      await createInvoiceMutation.mutateAsync({
        startDate: data.startDate,
        endDate: data.endDate,
        entityId: data.entityId,
        contractId: data.contractId,
        claimIds: data.claimIds,
      });
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
          <FiPlus className="mr-2 h-4 w-4" />
          {t("dialogs.createInvoice.button")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("dialogs.createInvoice.title")}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dialogs.createInvoice.fields.startDate")}</FormLabel>
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
                    <FormLabel>{t("dialogs.createInvoice.fields.endDate")}</FormLabel>
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
                  <FormLabel>{t("dialogs.createInvoice.fields.contract")}</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(
                        value === "none" ? undefined : Number(value)
                      )
                    }
                    value={field.value ? field.value.toString() : "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("dialogs.createInvoice.placeholders.selectContract")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">{t("dialogs.createInvoice.options.noContract")}</SelectItem>
                      {contractsData?.data?.map((contract: Contract) => (
                        <SelectItem
                          key={contract.id}
                          value={contract.id?.toString() || "none"}
                        >
                          {t("dialogs.createInvoice.displays.contractWithId", {
                            id: contract.id,
                            description: contract.description || t("dialogs.createInvoice.displays.noDescription")
                          })}
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
                  <FormLabel>{t("dialogs.createInvoice.fields.entity")}</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("dialogs.createInvoice.placeholders.selectEntity")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entitiesData?.data?.map((entity) => (
                        <SelectItem
                          key={entity.id}
                          value={entity.id.toString()}
                        >
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
                  <FormLabel>{t("dialogs.createInvoice.fields.claims")}</FormLabel>
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("dialogs.createInvoice.placeholders.selectClaims")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {claimsData?.data?.map((claim: Claim) => (
                        <SelectItem key={claim.id} value={claim.id.toString()}>
                          {t("dialogs.createInvoice.displays.claimWithId", {
                            id: claim.id,
                            startDate: claim.startDate,
                            endDate: claim.endDate
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((claimId: number) => (
                      <div
                        key={claimId}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
                      >
                        {t("claims.title")} #{claimId}
                        <button
                          type="button"
                          onClick={() =>
                            field.onChange(
                              field.value?.filter(
                                (id: number) => id !== claimId
                              )
                            )
                          }
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
                onClick={() => setOpen(false)}
                disabled={createInvoiceMutation.isPending}
              >
                {t("dialogs.createInvoice.buttons.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createInvoiceMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createInvoiceMutation.isPending
                  ? t("dialogs.createInvoice.buttons.creating")
                  : t("dialogs.createInvoice.buttons.create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
