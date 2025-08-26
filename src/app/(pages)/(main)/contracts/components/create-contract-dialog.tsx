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
  MineService,
  CreateMineDto,
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
  // Mine fields
  mineName: z.string().min(1, "اسم المنجم مطلوب"),
  mineLocation: z.string().optional(),
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
      mineName: "",
      mineLocation: "",
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
      // First, create the contract
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

      const contractResponse = await ContractService.contractControllerCreate({
        requestBody: createContractDto,
      });

      // Extract contract ID from response - handle different response structures
      const contractId =
        contractResponse.data?.id || contractResponse.id || contractResponse;

      if (!contractId || typeof contractId !== "number") {
        console.error("Invalid contract response:", contractResponse);
        throw new Error("Failed to get contract ID from response");
      }

      // Then, create the mine with reference to the new contract
      const createMineDto: CreateMineDto = {
        name: data.mineName,
        contractId: contractId,
        location: data.mineLocation || undefined,
      };

      await MineService.mineControllerCreate({
        requestBody: createMineDto,
      });

      toast.success("تم إنشاء العقد والمنجم بنجاح");
      form.reset();
      onOpenChange(false);
      onContractCreated?.();
    } catch (error) {
      toast.error("فشل في إنشاء العقد والمنجم");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>إنشاء عقد ومنجم جديد</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Contract Section - Left Side */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  معلومات العقد
                </h3>

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

                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="w-full">
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
                      <FormItem className="w-full">
                        <FormLabel>تاريخ الانتهاء (اختياري)</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name="dieselPrice"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>سعر الديزل الاساسي (اختياري)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="أدخل سعر الديزل الاساسي"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
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
                      <FormItem className="w-full">
                        <FormLabel>معامل التعديل (اختياري)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            placeholder="أدخل معامل التعديل"
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
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

                <FormField
                  control={form.control}
                  name="phosphatePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>سعر الفوسفات الاساسي (اختياري)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="أدخل سعر الفوسفات الاساسي"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined
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

              {/* Mine Section - Right Side */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  معلومات المنجم
                </h3>

                <FormField
                  control={form.control}
                  name="mineName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم المنجم</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل اسم المنجم" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mineLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>موقع المنجم (اختياري)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="أدخل موقع المنجم" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "جاري الإنشاء..." : "إنشاء العقد والمنجم"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
