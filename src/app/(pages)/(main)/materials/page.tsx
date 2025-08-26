"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateMaterialDialog } from "./components/create-material-dialog";
import { MaterialsTable } from "./components/materials-table";

export default function MaterialsPage() {
  const [showCreateMaterial, setShowCreateMaterial] = useState(false);
  const [retrigger, setRetrigger] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إعدادات المواد</h2>
          <p className="text-gray-600">إدارة المواد وخصائصها</p>
        </div>
        <Button onClick={() => setShowCreateMaterial(true)}>
          <Plus className="mr-2 h-4 w-4" />
          إضافة مادة
        </Button>
      </div>

      <MaterialsTable retrigger={retrigger} />

      <CreateMaterialDialog
        open={showCreateMaterial}
        onOpenChange={setShowCreateMaterial}
        onMaterialCreated={() => setRetrigger(retrigger + 1)}
      />
    </div>
  );
}
