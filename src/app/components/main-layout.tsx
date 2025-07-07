"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import {
  FiUsers,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiBriefcase,
  FiRepeat,
  FiEdit,
  FiLogOut,
  FiSend,
  FiCreditCard,
  FiBarChart2,
} from "react-icons/fi";
import { ReactNode, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { SettingsDialog } from "@/components/settings-dialog";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const { logout } = useAuth();
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
    // {
    //   name: t('navigation.dashboard'),
    //   path: "/home",
    //   icon: <FiBarChart2 className="h-5 w-5" />,
    // },
    {
      name: t('navigation.affiliatedCompanies'),
      path: "/affiliated-companies",
      icon: <FiBriefcase className="h-5 w-5" />,
    },
    // {
    //   name: t('navigation.financialClaims'),
    //   path: "/financial-claims",
    //   icon: <FiDollarSign className="h-5 w-5" />,
    // },
    {
      name: t('navigation.contracts'),
      path: "/contracts",
      icon: <FiEdit className="h-5 w-5" />,
    },
    // {
    //   name: t('navigation.documentCenter'),
    //   path: "/document-center",
    //   icon: <FiFileText className="h-5 w-5" />,
    // },
    {
      name: t('navigation.users'),
      path: "/users",
      icon: <FiUsers className="h-5 w-5" />,
    },
    {
      name: t('navigation.claims'),
      path: "/claims",
      icon: <FiRepeat className="h-5 w-5" />,
    },
    {
      name: t('navigation.requests'),
      path: "/requests",
      icon: <FiSend className="h-5 w-5" />,
    },
    {
      name: t('navigation.invoices'),
      path: "/invoices",
      icon: <FiCreditCard className="h-5 w-5" />,
    },
    {
      name: t('navigation.statistics'),
      path: "/statistics",
      icon: <FiBarChart2 className="h-5 w-5" />,
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
        <div className="p-4 mb-6 flex items-center space-x-inline-3">
          <div>
            <h1 className="text-2xl font-bold font-poppins text-gray-800">
              Ma&apos;an
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
                      className={`me-3 ${
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
                        className="ms-auto h-2 w-2 rounded-full bg-blue-500"
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
                      className={`me-3 ${
                        pathname.startsWith("/schedule")
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-blue-500"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                    <div className="ms-auto">
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

        {/* Settings and Logout */}
        <div className="mt-auto space-y-2">
          <SettingsDialog>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-gray-500 hover:text-blue-500 cursor-pointer w-full"
            >
              <FiSettings className="h-5 w-5" />
              <span className="font-medium text-sm">{t('common.settings', { defaultValue: 'الإعدادات' })}</span>
            </motion.div>
          </SettingsDialog>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 text-gray-500 hover:text-red-500 w-full"
          >
            <FiLogOut className="h-5 w-5" />
            <span className="font-medium text-sm">{t('common.logout', { defaultValue: 'تسجيل الخروج' })}</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full w-full bg-gray-50 overflow-auto">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
