import React, { cloneElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar(): void;
  user?: { name?: string; email?: string };
  roles: string[];
}

export default function Sidebar({ isOpen, toggleSidebar, user }: SidebarProps) {
  const { pathname } = useRouter();
  const navLinks = [
    { to: "/dashboard", icon: <HomeIcon />, text: "Dashboard" },
    { to: "/tasks",     icon: <ClipboardDocumentListIcon />, text: "Tasks" },
    { to: "/profile",   icon: <UserCircleIcon />, text: "Profile" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -280, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          className={`
            flex flex-col fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200
            transform transition-transform duration-200 ease-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0
          `}
        >
          {/* Logo & App Name */}
          <div className="relative flex items-center justify-center px-8 py-10">
            <motion.div
              className="absolute"
              initial={{ opacity: 0.2, scale: 0.6 }}
              animate={{ opacity: [0.2, 0.05, 0.2], scale: [0.6, 1.3, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-52 h-52 border-2 border-indigo-200 rounded-full" />
            </motion.div>
            <motion.div
              className="absolute"
              initial={{ opacity: 0.3, scale: 0.8 }}
              animate={{ opacity: [0.3, 0.1, 0.3], scale: [0.8, 1.5, 0.8] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: 0.4 }}
            >
              <div className="w-40 h-40 border-2 border-indigo-100 rounded-full" />
            </motion.div>
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative z-10 flex items-center space-x-3 bg-indigo-50 backdrop-blur-sm rounded-2xl p-4 cursor-pointer"
            >
              <Link href="/">
                <img src="/logo.svg" alt="App Logo" className="h-10 w-auto" />
              </Link>
              <span className="text-xl font-bold text-indigo-700 select-none">
                ProjectMate
              </span>
            </motion.div>
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 p-2 md:hidden focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600 hover:text-gray-800 transition" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 overflow-y-auto">
            <ul className="space-y-3">
              {navLinks.map(({ to, icon, text }, idx) => {
                const active = pathname === to;
                return (
                  <motion.li
                    key={to}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.07 }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <Link
                      href={to}
                      className={`
                        flex items-center gap-4 px-4 py-3 rounded-lg text-lg font-medium transition-colors
                        ${active
                          ? "bg-indigo-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
                      `}
                    >
                      <motion.span whileHover={{ scale: 1.1 }}>
                        {cloneElement(icon, {
                          className: active
                            ? "h-6 w-6 text-white"
                            : "h-6 w-6 text-gray-500"
                        })}
                      </motion.span>
                      <span className="flex-1">{text}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* User section */}
          {user && (
            <div className="px-6 py-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold"
                >
                  {user.name?.[0] || "U"}
                </motion.div>
                <div>
                  <p className="text-base font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {/* signOut() */}}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                Logout
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
