"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FiMoreVertical, FiEdit3, FiTrash2 } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUsers, useDeleteUser, useResetPassword } from "@/hooks/useUsers";
import type { UserResponse } from "../../../../../../client";
import { Skeleton } from "@/components/ui/skeleton";
import EditUserDialog from "./edit-user-dialog";

interface UsersTableProps {
  searchQuery?: string;
  roleFilter?: string;
  statusFilter?: string;
  entityFilter?: string;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
}

export function UsersTable({
  searchQuery = "",
  roleFilter,
  statusFilter,
  entityFilter,
  pageSize = 10,
  onPageSizeChange,
}: UsersTableProps) {
  const t = useTranslations();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: usersData,
    isLoading,
    error,
  } = useUsers({
    skip: currentPage * pageSize,
    take: pageSize,
    search: searchQuery || undefined,
    roleFilter: roleFilter || undefined,
    statusFilter: statusFilter || undefined,
    entityFilter: entityFilter || undefined,
  });

  const deleteUserMutation = useDeleteUser();
  const resetPasswordMutation = useResetPassword();

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && usersData?.data) {
      setSelectedUsers(usersData.data.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUserMutation.mutateAsync(id);
    setDeleteUserId(null);
  };

  const handleResetPassword = async () => {
    if (!resetPasswordUserId || !newPassword.trim()) return;
    
    try {
      await resetPasswordMutation.mutateAsync({
        userId: resetPasswordUserId,
        newPassword: newPassword.trim(),
      });
      setResetPasswordUserId(null);
      setNewPassword("");
    } catch {
      // Error is handled by the mutation
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors = {
      ADMIN: "bg-purple-100 text-purple-800",
      PRODUCTION_MANAGER: "bg-blue-100 text-blue-800",
      FINANCIAL_MANAGER: "bg-green-100 text-green-800",
      STANDARD_USER: "bg-gray-100 text-gray-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadgeColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const formatRole = (role: string) => {
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="rounded-md bg-white shadow-sm">
        <div className="p-4 border-b">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-white shadow-sm p-8 text-center">
        <p className="text-red-600">Error loading users: {error.message}</p>
      </div>
    );
  }

  const users = usersData?.data || [];
  const totalUsers = usersData?.rows || 0;
  const totalPages = Math.ceil(totalUsers / pageSize);
  return (
    <div className="rounded-md bg-white shadow-sm">
      {/* Integrated Table Controls */}
      <div className="p-4 border-b flex justify-between items-center gap-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">{t('table.show')}</span>
          <Select
            defaultValue={String(pageSize)}
            onValueChange={(value) => {
              setCurrentPage(0);
              onPageSizeChange?.(Number(value));
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 15, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-[40px]">
              <Checkbox
                checked={
                  users.length > 0 && selectedUsers.length === users.length
                }
                onCheckedChange={(checked) =>
                  handleSelectAll(checked as boolean)
                }
              />
            </TableHead>
            <TableHead>{t('common.id')}</TableHead>
            <TableHead>{t('users.fields.name')}</TableHead>
            <TableHead>{t('users.fields.entity')}</TableHead>
            <TableHead>{t('users.fields.email')}</TableHead>
            <TableHead>{t('users.fields.role')}</TableHead>
            <TableHead>{t('common.status')}</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) =>
                    handleSelectUser(user.id, checked as boolean)
                  }
                />
              </TableCell>
              <TableCell className="font-mono text-sm">{user.id}</TableCell>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>{user.entityId || t('users.fields.noEntity')}</TableCell>
              <TableCell>{user.email || t('users.fields.noEmail')}</TableCell>
              <TableCell>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {formatRole(user.role)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusBadgeColor(user.isActive)}>
                  {user.isActive ? t('users.status.active') : t('users.status.inactive')}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <FiMoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingUser(user)}
                      className="cursor-pointer"
                    >
                      <FiEdit3 className="mr-2 h-4 w-4" />
                      {t('users.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setResetPasswordUserId(Number(user.id))}
                      className="cursor-pointer"
                    >
                      {t('users.actions.resetPassword')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeleteUserId(Number(user.id))}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <FiTrash2 className="mr-2 h-4 w-4" />
                      {t('users.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-600">
            {t('pagination.showing', { start: currentPage * pageSize + 1, end: Math.min((currentPage + 1) * pageSize, totalUsers), total: totalUsers })}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              {t('pagination.previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
              }
              disabled={currentPage === totalPages - 1}
            >
              {t('pagination.next')}
            </Button>
          </div>
        </div>
      )}

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
        />
      )}

      {/* Delete User Confirmation */}
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.messages.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserId && handleDeleteUser(deleteUserId)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <AlertDialog
        open={!!resetPasswordUserId}
        onOpenChange={() => {
          setResetPasswordUserId(null);
          setNewPassword("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('users.actions.resetPassword')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('users.messages.resetPasswordDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder={t('users.placeholders.newPassword')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setResetPasswordUserId(null);
                setNewPassword("");
              }}
            >
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetPassword}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={resetPasswordMutation.isPending || newPassword.length < 6}
            >
              {resetPasswordMutation.isPending ? t('users.messages.resetting') : t('users.actions.resetPassword')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
