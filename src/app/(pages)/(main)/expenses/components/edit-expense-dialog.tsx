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
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ExpenseService,
  UpdateExpenseDto,
  ExpenseResponse,
} from "../../../../../../client";

const updateExpenseSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  unit: z.string().min(1, "الوحدة مطلوبة"),
  isActive: z.boolean().optional(),
});

type UpdateExpenseFormData = z.infer<typeof updateExpenseSchema>;

interface EditExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseResponse | null;
  onExpenseUpdated: () => void;
}

export function EditExpenseDialog({
  open,
  onOpenChange,
  expense,
  onExpenseUpdated,
}: EditExpenseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateExpenseFormData>({
    resolver: zodResolver(updateExpenseSchema),
    defaultValues: {
      name: "",
      unit: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (expense && open) {
      form.reset({
        name: expense.name,
        unit: expense.unit,
        isActive: expense.isActive,
      });
    }
  }, [expense, open, form]);

  const onSubmit = async (data: UpdateExpenseFormData) => {
    if (!expense) return;
    
    setIsLoading(true);
    try {
      const updateExpenseDto: UpdateExpenseDto = {
        name: data.name,
        unit: data.unit,
        isActive: data.isActive,
      };

      await ExpenseService.expenseControllerUpdate({
        id: expense.id,
        requestBody: updateExpenseDto,
      });

      toast.success("تم تحديث المصروف بنجاح");
      onOpenChange(false);
      onExpenseUpdated();
    } catch (error) {
      toast.error("فشل في تحديث المصروف");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل المصروف</DialogTitle>
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
                  <FormLabel>الوحدة</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="أدخل وحدة المصروف" />
                  </FormControl>
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
                  </div>
                  <FormControl>
                    <Switch
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
                {isLoading ? "جاري التحديث..." : "تحديث المصروف"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}