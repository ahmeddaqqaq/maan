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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ContractService,
  UpdateContractDto,
  ContractResponse,
} from "../../../../../../client";

const updateContractSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  startDate: z.string().min(1, "تاريخ البدء مطلوب"),
  endDate: z.string().optional(),
  dieselPrice: z.number().optional(),
  extractionPrice: z.number().optional(),
  phosphatePrice: z.number().optional(),
});

type UpdateContractFormData = z.infer<typeof updateContractSchema>;

interface EditContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: ContractResponse | null;
  onContractUpdated?: () => void;
}

export function EditContractDialog({
  open,
  onOpenChange,
  contract,
  onContractUpdated,
}: EditContractDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateContractFormData>({
    resolver: zodResolver(updateContractSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      dieselPrice: undefined,
      extractionPrice: undefined,
      phosphatePrice: undefined,
    },
  });


  useEffect(() => {
    if (contract && open) {
      form.reset({
        name: contract.name,
        description: contract.description,
        startDate: contract.startDate.split("T")[0],
        endDate: contract.endDate ? contract.endDate.split("T")[0] : "",
        dieselPrice: contract.dieselPrice,
        extractionPrice: contract.extractionPrice,
        phosphatePrice: contract.phosphatePrice,
      });
    }
  }, [contract, open, form]);

  const onSubmit = async (data: UpdateContractFormData) => {
    if (!contract) return;
    
    setIsLoading(true);
    try {
      const updateContractDto: UpdateContractDto = {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        dieselPrice: data.dieselPrice,
        extractionPrice: data.extractionPrice,
        phosphatePrice: data.phosphatePrice,
      };

      await ContractService.contractControllerUpdate({
        id: contract.id,
        requestBody: updateContractDto,
      });

      toast.success("تم تحديث العقد بنجاح");
      onOpenChange(false);
      onContractUpdated?.();
    } catch (error) {
      toast.error("فشل في تحديث العقد");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل العقد</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="أدخل اسم العقد" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="أدخل وصف العقد" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">الجهة</label>
              <div className="px-3 py-2 border rounded-md bg-muted">
                {contract?.entity?.name || "غير متوفر"}
              </div>
              <p className="text-xs text-muted-foreground">لا يمكن تعديل الجهة للعقد</p>
            </div>

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تاريخ البدء</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
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
                  <FormLabel>تاريخ الانتهاء (اختياري)</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">معلومات التسعير</h3>

              <FormField
                control={form.control}
                name="dieselPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سعر الديزل (اختياري)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="أدخل سعر الديزل"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="extractionPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سعر الاستخراج (اختياري)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="أدخل سعر الاستخراج"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phosphatePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سعر الفوسفات (اختياري)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        placeholder="أدخل سعر الفوسفات"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "جاري التحديث..." : "تحديث العقد"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}