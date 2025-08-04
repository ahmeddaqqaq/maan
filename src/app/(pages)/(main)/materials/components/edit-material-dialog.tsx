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
  MaterialService,
  UpdateMaterialDto,
  MaterialResponse,
} from "../../../../../../client";

const updateMaterialSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  unit: z.string().min(1, "الوحدة مطلوبة"),
  isActive: z.boolean().optional(),
});

type UpdateMaterialFormData = z.infer<typeof updateMaterialSchema>;

interface EditMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: MaterialResponse | null;
  onMaterialUpdated: () => void;
}

export function EditMaterialDialog({
  open,
  onOpenChange,
  material,
  onMaterialUpdated,
}: EditMaterialDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateMaterialFormData>({
    resolver: zodResolver(updateMaterialSchema),
    defaultValues: {
      name: "",
      unit: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (material && open) {
      form.reset({
        name: material.name,
        unit: material.unit,
        isActive: material.isActive,
      });
    }
  }, [material, open, form]);

  const onSubmit = async (data: UpdateMaterialFormData) => {
    if (!material) return;
    
    setIsLoading(true);
    try {
      const updateMaterialDto: UpdateMaterialDto = {
        name: data.name,
        unit: data.unit,
        isActive: data.isActive,
      };

      await MaterialService.materialControllerUpdate({
        id: material.id,
        requestBody: updateMaterialDto,
      });

      toast.success("تم تحديث المادة بنجاح");
      onOpenChange(false);
      onMaterialUpdated();
    } catch (error) {
      toast.error("فشل في تحديث المادة");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل المادة</DialogTitle>
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
                    <Input {...field} placeholder="أدخل وحدة المادة" />
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
                {isLoading ? "جاري التحديث..." : "تحديث المادة"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}