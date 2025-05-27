"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { motion } from "framer-motion";

type MenuItem = {
  name: string;
  href: string;
  icon: string;
  hasBorderTop?: boolean;
};

type Props = {
  children: ReactNode;
};

const menuItems: MenuItem[] = [
  { name: "Dashboard", href: "/admin", icon: "🏠" },
  { name: "User", href: "/admin/users", icon: "🙆" },
  { name: "Booking", href: "/admin/bookings", icon: "📅" },
  { name: "Room", href: "/admin/rooms", icon: "🏡" },
  { name: "Location", href: "/admin/locations", icon: "🗺️" },

  { name: "Settings", href: "/admin/settings", icon: "⚙️", hasBorderTop: true },
  { name: "Usage Policy", href: "/admin/policy", icon: "📜" },
];

const SideBar = ({ children }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex">
      <aside className="fixed top-24 left-0 bottom-0 w-64 text-black p-6 bg-white z-40">
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li
                key={item.href}
                className={item.hasBorderTop ? "border-t border-gray-300 pt-5 mt-7" : ""}
              >
                <Link href={item.href} >
                  <motion.div
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ease-in-out ${
                      pathname === item.href
                        ? "bg-[#fe6b6e] text-white"
                        : "hover:bg-[#fe6b6e]/50 text-gray-700 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="whitespace-nowrap">{item.name}</span>
                  </motion.div>
                </Link>
              </li>
            ))}
            <li>
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-3 p-3 rounded-lg w-full text-left transition-all duration-300 ease-in-out hover:bg-[#fe6b6e]/50 text-gray-700 hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">🚪</span>
                <span className="whitespace-nowrap">Logout</span>
              </motion.button>
            </li>
          </ul>
        </nav>
      </aside>

      <motion.main
        className="ml-64 mt-24 p-8 w-full min-h-screen bg-gray-100"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0 }}
      >
        <div>{children}</div>
      </motion.main>
    </div>
  );
};

export default SideBar;