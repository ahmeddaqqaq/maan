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
  CreateExpenseDto,
  ExpenseService,
  EntityService,
  EntityResponse,
} from "../../../../../../client";

const createExpenseSchema = z.object({
  name: z.string().min(1, "مطلوب اسم المصروف"),
  unit: z.string().min(1, "مطلوب وحدة القياس"),
  isActive: z.boolean(),
  entityId: z.number().min(1, "مطلوب اختيار الشركة"),
});

type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;

interface CreateExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseCreated?: () => void;
}

export function CreateExpenseDialog({
  open,
  onOpenChange,
  onExpenseCreated,
}: CreateExpenseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState<EntityResponse[]>([]);

  const form = useForm<CreateExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      name: "",
      unit: "",
      isActive: true,
      entityId: 0,
    },
  });

  // Load entities
  useEffect(() => {
    const loadEntities = async () => {
      try {
        const response = await EntityService.entityControllerFindMany({});
        setEntities(response.data || []);
      } catch (error) {
        console.error("فشل تحميل الشركات:", error);
      }
    };

    if (open) {
      loadEntities();
    }
  }, [open]);

  const onSubmit = async (data: CreateExpenseFormData) => {
    setIsLoading(true);
    try {
      const createExpenseDto: CreateExpenseDto = {
        name: data.name,
        unit: data.unit,
        isActive: data.isActive,
        entityId: data.entityId,
      };

      await ExpenseService.expenseControllerCreate({
        requestBody: createExpenseDto,
      });

      toast.success("تم إنشاء المصروف بنجاح");
      form.reset();
      onOpenChange(false);
      onExpenseCreated?.();
    } catch (error) {
      toast.error("فشل إنشاء المصروف");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء مصروف جديد</DialogTitle>
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
                    <Input {...field} placeholder="أدخل اسم المصروف" />
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
                  <FormLabel>وحدة القياس</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="أدخل الوحدة (مثل: قطعة، كجم، ساعات)"
                    />
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
                  <FormLabel>الشركة</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر الشركة" />
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">مفعل</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      تفعيل أو تعطيل هذا النوع من المصروفات
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      lang="ar"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "جاري الإنشاء..." : "إنشاء مصروف"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
