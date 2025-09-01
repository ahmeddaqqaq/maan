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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  CreateMaterialDto,
  MaterialService,
  ContractResponse,
  ContractService,
} from "../../../../../../client";

const createMaterialSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  unit: z.string().min(1, "الوحدة مطلوبة"),
  isActive: z.boolean(),
  contractId: z.number().min(1, "العقد مطلوب"),
});

type CreateMaterialFormData = z.infer<typeof createMaterialSchema>;

interface CreateMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialCreated?: () => void;
}

export function CreateMaterialDialog({
  open,
  onOpenChange,
  onMaterialCreated,
}: CreateMaterialDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [contracts, setContracts] = useState<ContractResponse[]>([]);

  const form = useForm<CreateMaterialFormData>({
    resolver: zodResolver(createMaterialSchema),
    defaultValues: {
      name: "",
      unit: "",
      isActive: true,
      contractId: 0,
    },
  });

  useEffect(() => {
    const loadContracts = async () => {
      try {
        const response = await ContractService.contractControllerFindMany({});
        setContracts(response.data || []);
      } catch (error) {
        console.error("فشل تحميل العقود:", error);
      }
    };

    if (open) {
      loadContracts();
    }
  }, [open]);

  const onSubmit = async (data: CreateMaterialFormData) => {
    setIsLoading(true);
    try {
      const createMaterialDto: CreateMaterialDto = {
        name: data.name,
        unit: data.unit,
        isActive: data.isActive,
        contractId: data.contractId,
      };

      await MaterialService.materialControllerCreate({
        requestBody: createMaterialDto,
      });

      toast.success("تم إنشاء المادة بنجاح");
      form.reset();
      onOpenChange(false);
      onMaterialCreated?.();
    } catch (error) {
      toast.error("فشل إنشاء المادة");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء مادة جديدة</DialogTitle>
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
                    <Input {...field} placeholder="أدخل اسم المادة" />
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
                  <FormLabel>الوحدة</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="أدخل الوحدة (مثال: كغ، طن، م³)"
                    />
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
                  <FormLabel>العقد</FormLabel>
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">نشط</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      تفعيل أو تعطيل هذه المادة
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      dir="ltr"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "جارٍ الإنشاء..." : "إنشاء المادة"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
