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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  CreateUserDto,
  UserService,
  EntityService,
  EntityResponse,
} from "../../../../../../client";

const createUserSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  email: z
    .string()
    .email("بريد إلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
  role: z.enum([
    "ADMIN",
    "PRODUCTION_MANAGER",
    "FINANCIAL_MANAGER",
    "STANDARD_USER",
  ]),
  entityId: z.number().min(1, "الشركة مطلوب"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: () => void;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onUserCreated,
}: CreateUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState<EntityResponse[]>([]);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      isActive: true,
      role: "STANDARD_USER",
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
        console.error("Failed to load entities:", error);
      }
    };

    if (open) {
      loadEntities();
    }
  }, [open]);

  const onSubmit = async (data: CreateUserFormData) => {
    setIsLoading(true);
    try {
      const createUserDto: CreateUserDto = {
        username: data.username,
        password: data.password,
        email: data.email || undefined,
        isActive: data.isActive,
        role: data.role as CreateUserDto.role,
        entityId: data.entityId,
      };

      await UserService.userControllerCreate({
        requestBody: createUserDto,
      });

      toast.success("تم إنشاء المستخدم بنجاح");
      form.reset();
      onOpenChange(false);
      onUserCreated?.();
    } catch (error) {
      toast.error("فشل في إنشاء المستخدم");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إنشاء مستخدم جديد</DialogTitle>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="أدخل كلمة المرور"
                    />
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
                  <FormLabel>البريد الإلكتروني (اختياري)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="أدخل البريد الإلكتروني"
                    />
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر الدور" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">مدير</SelectItem>
                      <SelectItem value="PRODUCTION_MANAGER">
                        مدير إنتاج
                      </SelectItem>
                      <SelectItem value="FINANCIAL_MANAGER">
                        مدير مالي
                      </SelectItem>
                      <SelectItem value="STANDARD_USER">مستخدم عادي</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <FormLabel className="text-base">نشط</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      تفعيل أو تعطيل حساب المستخدم
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
                {isLoading ? "جاري الإنشاء..." : "إنشاء مستخدم"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
