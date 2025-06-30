// app/page.tsx
"use client";

import TopBar from "@/app/(pages)/components/top-bar";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { UsersTable } from "./components/users-table";

interface userTableData {
  id: string;
  name: string;
  company: string;
  email: string;
  role: string;
  status: string;
}

export default function () {
  const userData: userTableData[] = [
    {
      id: "MP001",
      name: "Sameer Samer",
      company: "Gulf Mining & Resources",
      role: "Production Manager",
      status: "Active",
      email: "sameer@example.com",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <TopBar />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-4 pb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FiPlus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        <UsersTable data={userData} />
      </div>
    </div>
  );
}
