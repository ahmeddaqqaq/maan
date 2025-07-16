"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateUserDialog } from "./components/create-user-dialog";
import { UsersTable } from "./components/users-table";

export default function SettingsPage() {
  const [showCreateUser, setShowCreateUser] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Settings</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Button onClick={() => setShowCreateUser(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UsersTable />

      <CreateUserDialog
        open={showCreateUser}
        onOpenChange={setShowCreateUser}
      />
    </div>
  );
}