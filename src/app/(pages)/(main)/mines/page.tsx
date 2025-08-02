"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateMineDialog } from "./components/create-mine-dialog";
import { MinesTable } from "./components/mines-table";

export default function MinesPage() {
  const [showCreateMine, setShowCreateMine] = useState(false);
  const [retrigger, setRetrigger] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إعدادات المعادن</h2>
          <p className="text-gray-600">إدارة المعادن ومواقعها</p>
        </div>
        <Button onClick={() => setShowCreateMine(true)}>
          <Plus className="mr-2 h-4 w-4" />
          إضافة منجم
        </Button>
      </div>

      <MinesTable retrigger={retrigger} />

      <CreateMineDialog
        open={showCreateMine}
        onOpenChange={setShowCreateMine}
        onMineCreated={() => setRetrigger(retrigger + 1)}
      />
    </div>
  );
}
