"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateContractDialog } from "./components/create-contract-dialog";
import { ContractsTable } from "./components/contracts-table";

export default function ContractsPage() {
  const [showCreateContract, setShowCreateContract] = useState(false);
  const [retrigger, setRetrigger] = useState(0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إعدادات العقود</h2>
          <p className="text-gray-600">إدارة العقود وتفاصيلها</p>
        </div>
        <Button onClick={() => setShowCreateContract(true)}>
          <Plus className="me-2 h-4 w-4" />
          إضافة عقد
        </Button>
      </div>

      <ContractsTable retrigger={retrigger} />

      <CreateContractDialog
        open={showCreateContract}
        onOpenChange={setShowCreateContract}
        onContractCreated={() => setRetrigger(retrigger + 1)}
      />
    </div>
  );
}
