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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  EntityService,
  UpdateEntityDto,
  EntityResponse,
} from "../../../../../../client";

const updateEntitySchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
});

type UpdateEntityFormData = z.infer<typeof updateEntitySchema>;

interface EditEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entity: EntityResponse | null;
  onEntityUpdated: () => void;
}

export function EditEntityDialog({
  open,
  onOpenChange,
  entity,
  onEntityUpdated,
}: EditEntityDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateEntityFormData>({
    resolver: zodResolver(updateEntitySchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (entity && open) {
      form.reset({
        name: entity.name,
      });
    }
  }, [entity, open, form]);

  const onSubmit = async (data: UpdateEntityFormData) => {
    if (!entity) return;
    
    setIsLoading(true);
    try {
      const updateEntityDto: UpdateEntityDto = {
        name: data.name,
      };

      await EntityService.entityControllerUpdate({
        id: entity.id,
        requestBody: updateEntityDto,
      });

      toast.success("تم تحديث الجهة بنجاح");
      onOpenChange(false);
      onEntityUpdated();
    } catch (error) {
      toast.error("فشل في تحديث الجهة");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل الجهة</DialogTitle>
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
                    <Input {...field} placeholder="أدخل اسم الجهة" />
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
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "جاري التحديث..." : "تحديث الجهة"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}