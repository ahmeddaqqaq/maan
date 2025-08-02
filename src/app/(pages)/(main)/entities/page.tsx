"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateEntityDialog } from "./components/create-entity-dialog";
import { EntitiesTable } from "./components/entities-table";

export default function EntitiesPage() {
  const [showCreateEntity, setShowCreateEntity] = useState(false);
  const [retrigger, setRetrigger] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إعدادات الجهات</h2>
          <p className="text-gray-600">إدارة الجهات وخصائصها</p>
        </div>
        <Button onClick={() => setShowCreateEntity(true)}>
          <Plus className="mr-2 h-4 w-4" />
          إضافة جهة
        </Button>
      </div>

      <EntitiesTable retrigger={retrigger} />

      <CreateEntityDialog
        open={showCreateEntity}
        onOpenChange={setShowCreateEntity}
        onEntityCreated={() => setRetrigger(retrigger + 1)}
      />
    </div>
  );
}
