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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  UserService,
  UpdateUserDto,
  UserResponse,
} from "../../../../../../client";

const updateUserSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional(),
  role: z.enum(["ADMIN", "PRODUCTION_MANAGER", "FINANCIAL_MANAGER", "STANDARD_USER"]),
  isActive: z.boolean().optional(),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
  onUserUpdated: () => void;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onUserUpdated,
}: EditUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "PRODUCTION_MANAGER",
      isActive: true,
    },
  });

  useEffect(() => {
    if (user && open) {
      form.reset({
        username: user.username,
        email: user.email || "",
        role: user.role as "ADMIN" | "PRODUCTION_MANAGER" | "FINANCIAL_MANAGER" | "STANDARD_USER",
        isActive: user.isActive,
      });
    }
  }, [user, open, form]);

  const onSubmit = async (data: UpdateUserFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updateUserDto: UpdateUserDto = {
        username: data.username,
        email: data.email || undefined,
        role: data.role as UpdateUserDto.role,
        isActive: data.isActive,
      };

      await UserService.userControllerUpdate({
        id: user.id,
        requestBody: updateUserDto,
      });

      toast.success("تم تحديث المستخدم بنجاح");
      onOpenChange(false);
      onUserUpdated();
    } catch (error) {
      toast.error("فشل في تحديث المستخدم");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل المستخدم</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المستخدم</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="أدخل اسم المستخدم" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="أدخل البريد الإلكتروني" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الدور</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر دور" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">مدير النظام</SelectItem>
                      <SelectItem value="PRODUCTION_MANAGER">مدير الإنتاج</SelectItem>
                      <SelectItem value="FINANCIAL_MANAGER">مدير مالي</SelectItem>
                      <SelectItem value="STANDARD_USER">مستخدم عادي</SelectItem>
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

            <div className="flex justify-end space-x-2 space-x-reverse">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "جاري التحديث..." : "تحديث المستخدم"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}