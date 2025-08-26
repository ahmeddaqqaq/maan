"use client";

import { useState } from "react";
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
import { CreateEntityDto, EntityService } from "../../../../../../client";

const createEntitySchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
});

type CreateEntityFormData = z.infer<typeof createEntitySchema>;

interface CreateEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEntityCreated?: () => void;
}

export function CreateEntityDialog({
  open,
  onOpenChange,
  onEntityCreated,
}: CreateEntityDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateEntityFormData>({
    resolver: zodResolver(createEntitySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateEntityFormData) => {
    setIsLoading(true);
    try {
      const createEntityDto: CreateEntityDto = {
        name: data.name,
      };

      await EntityService.entityControllerCreate({
        requestBody: createEntityDto,
      });

      toast.success("تم إنشاء الجهة بنجاح");
      form.reset();
      onOpenChange(false);
      onEntityCreated?.();
    } catch (error) {
      toast.error("فشل في إنشاء الجهة");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء جهة جديدة</DialogTitle>
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

            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "جارٍ الإنشاء..." : "إنشاء الجهة"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
