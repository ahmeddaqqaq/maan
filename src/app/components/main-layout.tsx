"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import {
  LogOut,
  Package,
  Mountain,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: "Monthly Extractions", href: "/extractions", icon: TrendingUp },
  { name: "Users", href: "/users", icon: Users },
  { name: "Mines", href: "/mines", icon: Mountain },
  { name: "Materials", href: "/materials", icon: Package },
  { name: "Contracts", href: "/contracts", icon: FileText },
];

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

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
              <Button
                variant="ghost"
                size="sm"
                className="px-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={logout}
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
