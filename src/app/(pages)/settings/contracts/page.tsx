"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateContractDialog } from "./components/create-contract-dialog";
import { ContractsTable } from "./components/contracts-table";

export default function ContractsPage() {
  const [showCreateContract, setShowCreateContract] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contract Settings</h2>
          <p className="text-gray-600">Manage contracts and their details</p>
        </div>
        <Button onClick={() => setShowCreateContract(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contract
        </Button>
      </div>

      <ContractsTable />

      <CreateContractDialog
        open={showCreateContract}
        onOpenChange={setShowCreateContract}
      />
    </div>
  );
}