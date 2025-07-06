"use client";

import { useTranslations } from 'next-intl';
import TopBar from "@/app/(pages)/components/top-bar";
import { UsersTable } from "./components/users-table";
import CreateUserDialog from "../../components/create-user-dialog";

export default function UsersPage() {
  const t = useTranslations();

  return (
    <div className="flex flex-col h-full">
      {/* <TopBar /> */}

      <div className="flex-1 overflow-auto p-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {t('users.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                {t('users.description')}
              </p>
            </div>
            <div className="flex gap-3">
              <CreateUserDialog />
            </div>
          </div>

          {/* Users Table */}
          <UsersTable />
        </div>
      </div>
    </div>
  );
}
