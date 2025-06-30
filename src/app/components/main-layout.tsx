"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiBarChart2,
  FiBriefcase,
  FiDollarSign,
  FiFileText,
  FiRepeat,
} from "react-icons/fi";
import { ReactNode, useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [isScheduleOpen, setIsScheduleOpen] = useState(
    pathname.startsWith("/schedule")
  );

  const navItems: {
    name: string;
    path: string;
    icon: ReactNode;
    submenu?: { name: string; path: string }[];
  }[] = [
    {
      name: "Monthly Production",
      path: "/home",
      icon: <FiBarChart2 className="h-5 w-5" />,
    },
    {
      name: "Affiliated Companies",
      path: "/affiliated-companies",
      icon: <FiBriefcase className="h-5 w-5" />,
    },
    {
      name: "Financial Claims",
      path: "/financial-claims",
      icon: <FiDollarSign className="h-5 w-5" />,
    },
    {
      name: "Document Center",
      path: "/document-center",
      icon: <FiFileText className="h-5 w-5" />,
    },
    {
      name: "Users",
      path: "/users",
      icon: <FiUsers className="h-5 w-5" />,
    },
    {
      name: "Requests",
      path: "/requests",
      icon: <FiRepeat className="h-5 w-5" />,
    },
  ];

  const toggleScheduleMenu = () => {
    setIsScheduleOpen(!isScheduleOpen);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 bg-white text-gray-500 p-4 border-r border-gray-200">
        {/* Logo/Brand */}
        <div className="p-4 mb-6 flex items-center space-x-3">
          <div>
            <h1 className="text-2xl font-bold font-poppins text-gray-800">
              Ma'an
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <div key={item.name}>
              {item.path ? (
                <Link href={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 group ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <div
                      className={`mr-3 ${
                        isActive(item.path)
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-blue-500"
                      }`}
                    >
                      {item.icon}
                    </div>
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
              ) : (
                <>
                  <div
                    className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 group cursor-pointer ${
                      pathname.startsWith("/schedule")
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                    onClick={toggleScheduleMenu}
                  >
                    <div
                      className={`mr-3 ${
                        pathname.startsWith("/schedule")
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-blue-500"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                    <div className="ml-auto">
                      {isScheduleOpen ? (
                        <FiChevronDown className="h-4 w-4" />
                      ) : (
                        <FiChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        {/* Settings */}
        <div className="mt-auto">
          <Link href="/settings">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
                isActive("/settings")
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-blue-500"
              }`}
            >
              <FiSettings className="h-5 w-5" />
              <span className="font-medium text-sm">Settings</span>
            </motion.div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full w-full bg-gray-50 overflow-auto">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
