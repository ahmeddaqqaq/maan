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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ContractService,
  CreateContractDto,
  EntityService,
  EntityResponse,
} from "../../../../../../client";

const createContractSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  entityId: z.number().min(1, "الجهة مطلوبة"),
  description: z.string().min(1, "الوصف مطلوب"),
  startDate: z.string().min(1, "تاريخ البدء مطلوب"),
  endDate: z.string().optional(),
  dieselPrice: z.number().optional(),
  extractionPrice: z.number().optional(),
  phosphatePrice: z.number().optional(),
});

type CreateContractFormData = z.infer<typeof createContractSchema>;

interface CreateContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContractCreated?: () => void;
}

export function CreateContractDialog({
  open,
  onOpenChange,
  onContractCreated,
}: CreateContractDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState<EntityResponse[]>([]);

  const form = useForm<CreateContractFormData>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      name: "",
      entityId: 0,
      description: "",
      startDate: "",
      endDate: "",
      dieselPrice: undefined,
      extractionPrice: undefined,
      phosphatePrice: undefined,
    },
  });

  useEffect(() => {
    const loadEntities = async () => {
      try {
        const response = await EntityService.entityControllerFindMany({});
        setEntities(response.data || []);
      } catch (error) {
        console.error("فشل في تحميل الجهات:", error);
      }
    };

    if (open) {
      loadEntities();
    }
  }, [open]);

  const onSubmit = async (data: CreateContractFormData) => {
    setIsLoading(true);
    try {
      const createContractDto: CreateContractDto = {
        name: data.name,
        entityId: data.entityId,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
        dieselPrice: data.dieselPrice,
        extractionPrice: data.extractionPrice,
        phosphatePrice: data.phosphatePrice,
      };

      await ContractService.contractControllerCreate({
        requestBody: createContractDto,
      });

      toast.success("تم إنشاء العقد بنجاح");
      form.reset();
      onOpenChange(false);
      onContractCreated?.();
    } catch (error) {
      toast.error("فشل في إنشاء العقد");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>إنشاء عقد جديد</DialogTitle>
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

            <FormField
              control={form.control}
              name="entityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الجهة</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر جهة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {entities.map((entity) => (
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
                {isLoading ? "جاري الإنشاء..." : "إنشاء العقد"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
