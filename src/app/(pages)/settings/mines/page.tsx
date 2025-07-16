"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateMineDialog } from "./components/create-mine-dialog";
import { MinesTable } from "./components/mines-table";

export default function MinesPage() {
  const [showCreateMine, setShowCreateMine] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mine Settings</h2>
          <p className="text-gray-600">Manage mines and their locations</p>
        </div>
        <Button onClick={() => setShowCreateMine(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Mine
        </Button>
      </div>

      <MinesTable />

      <CreateMineDialog
        open={showCreateMine}
        onOpenChange={setShowCreateMine}
      />
    </div>
  );
}