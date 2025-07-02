"use client";

import TopBar from "@/app/(pages)/components/top-bar";
import { RequestsTable } from "./components/requests-table";
import CreateRequestDialog from "./components/create-request-dialog";

export default function RequestsPage() {
  return (
    <div className="flex flex-col h-full">
      <TopBar />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Requests</h1>
            <CreateRequestDialog />
          </div>
        </div>

        <RequestsTable />
      </div>
    </div>
  );
}