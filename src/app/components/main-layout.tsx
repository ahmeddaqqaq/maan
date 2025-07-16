"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Settings,
  LogOut,
  Home,
  Package,
  Mountain,
  FileText,
  ClipboardList,
  Receipt,
  TrendingUp,
  Users,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UsersTable } from "../(pages)/settings/components/users-table";
import { CreateUserDialog } from "../(pages)/settings/components/create-user-dialog";
import { MinesTable } from "../(pages)/settings/mines/components/mines-table";
import { CreateMineDialog } from "../(pages)/settings/mines/components/create-mine-dialog";
import { MaterialsTable } from "../(pages)/settings/materials/components/materials-table";
import { CreateMaterialDialog } from "../(pages)/settings/materials/components/create-material-dialog";
import { ContractsTable } from "../(pages)/settings/contracts/components/contracts-table";
import { CreateContractDialog } from "../(pages)/settings/contracts/components/create-contract-dialog";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Monthly Extractions", href: "/extractions", icon: TrendingUp },
  { name: "Invoices", href: "/invoices", icon: Receipt },
];

const settingsTabs = [
  { name: "Users", icon: Users, content: <UsersSettings /> },
  { name: "Mines", icon: Mountain, content: <MinesSettings /> },
  { name: "Materials", icon: Package, content: <MaterialsSettings /> },
  { name: "Contracts", icon: FileText, content: <ContractsSettings /> },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("Users");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-gray-100 bg-white">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center h-16 px-4 border-b border-gray-100">
            <h1 className="text-xl font-semibold text-gray-800">Ma&apos;an</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-blue-500" : "text-gray-400"
                    )}
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom buttons */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 justify-start px-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  >
                    <Settings className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Settings</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="min-w-6xl h-[85vh] flex p-0 overflow-hidden">
                  {/* Settings Sidebar */}
                  <div className="w-56 border-r bg-white flex flex-col">
                    <DialogHeader className="p-4 border-b">
                      <DialogTitle className="text-gray-800">
                        Settings
                      </DialogTitle>
                    </DialogHeader>
                    <nav className="p-2 space-y-1">
                      {settingsTabs.map((tab) => {
                        const isActive = activeSettingsTab === tab.name;
                        const Icon = tab.icon;
                        return (
                          <Button
                            key={tab.name}
                            variant="ghost"
                            onClick={() => setActiveSettingsTab(tab.name)}
                            className={cn(
                              "w-full justify-start px-3 py-2.5 text-sm font-medium rounded-md",
                              isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <Icon
                              className={cn(
                                "mr-3 h-5 w-5",
                                isActive ? "text-blue-500" : "text-gray-400"
                              )}
                            />
                            {tab.name}
                          </Button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Settings Content */}
                  <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {
                      settingsTabs.find((tab) => tab.name === activeSettingsTab)
                        ?.content
                    }
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="sm"
                className="px-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 text-gray-500" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto focus:outline-none bg-white">
          <div className="py-6">
            <div className="px-4">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

function UsersSettings() {
  const [showCreateUser, setShowCreateUser] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Users Management
          </h2>
          <p className="text-gray-500 text-sm">
            Manage system users and permissions
          </p>
        </div>
        <Button
          onClick={() => setShowCreateUser(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
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

function MinesSettings() {
  const [showCreateMine, setShowCreateMine] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Mines Configuration
          </h2>
          <p className="text-gray-500 text-sm">
            Configure mine locations and properties
          </p>
        </div>
        <Button
          onClick={() => setShowCreateMine(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
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

function MaterialsSettings() {
  const [showCreateMaterial, setShowCreateMaterial] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Materials Settings
          </h2>
          <p className="text-gray-500 text-sm">
            Manage material types and categories
          </p>
        </div>
        <Button
          onClick={() => setShowCreateMaterial(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Material
        </Button>
      </div>

      <MaterialsTable />

      <CreateMaterialDialog
        open={showCreateMaterial}
        onOpenChange={setShowCreateMaterial}
      />
    </div>
  );
}

function ContractsSettings() {
  const [showCreateContract, setShowCreateContract] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Contract Templates
          </h2>
          <p className="text-gray-500 text-sm">
            Configure contract templates and terms
          </p>
        </div>
        <Button
          onClick={() => setShowCreateContract(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
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
