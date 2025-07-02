"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      name: "Account",
      path: "/settings/account",
      isDisabled: true,
    },
    {
      name: "Roles",
      path: "/settings/roles",
      isDisabled: true,
    },
    {
      name: "Mines",
      path: "/settings/mines",
      isDisabled: false,
    },
    {
      name: "Materials",
      path: "/settings/materials",
      isDisabled: false,
    },
    {
      name: "Production",
      path: "/settings/production",
      isDisabled: true,
    },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 bg-white p-4 border-r border-gray-200">
        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <div key={item.name} className="px-2">
              {item.isDisabled ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center w-full p-3 rounded-lg cursor-not-allowed ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNavItem"
                      className="ml-auto h-2 w-2 rounded-full bg-blue-300"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.div>
              ) : (
                <Link href={item.path} passHref>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span className="font-medium text-sm">{item.name}</span>
                    {isActive(item.path) && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="ml-auto h-2 w-2 rounded-full bg-blue-500"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full w-full bg-gray-50 overflow-auto">
        <div className="h-full p-6">{children}</div>
      </main>
    </div>
  );
}
