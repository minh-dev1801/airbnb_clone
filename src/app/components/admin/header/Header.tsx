"use client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "antd";
import SearchBar from "../searchbar/SearchBar";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {};

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  avatar?: string;
  birthday?: string;
  gender?: boolean;
  role?: string;
};

const Header = (props: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); 
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const menu = {
    items: [
      {
        key: "profile",
        label: "Profile",
      },
      {
        key: "home",
        label: "Back Home",
      },
      {
        key: "logout",
        label: "Logout",
      },
    ],
    onClick: ({ key }: { key: string }) => {
      switch (key) {
        case "profile":
          console.log("Navigate to Profile");
          router.push("/admin/profile");
          break;
        case "home":
          console.log("Navigate to Home");
          router.push("/");
          break;
        case "logout":
          console.log("Logging out");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/");
          break;
        default:
          break;
      }
    },
  };

  const renderAvatar = () => {
    if (user?.avatar && user.avatar !== "") {
      return (
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-11 h-11 rounded-full cursor-pointer object-cover"
          onError={(e) => {
           
            e.currentTarget.style.display = "none";
            (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "flex";
          }}
        />
      );
    }
    // Nếu không có avatar, hiển thị chữ cái đầu của tên
    const initial = user?.name?.charAt(0)?.toUpperCase() || "U";
    return (
      <div className="w-11 h-11 rounded-full bg-[#fe6b6e] text-white flex items-center justify-center text-lg font-semibold cursor-pointer">
        {initial}
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white px-10 py-6 flex items-center justify-between">
      <Link href="/admin">
        <div className="flex items-center space-x-2">
          <img
            src="/airbnb-1.svg"
            alt="Airbnb Logo"
            className="h-9 w-9"
          />
          <span className="text-3xl font-bold text-[#fe6b6e]">
            airbnb
          </span>
        </div>
      </Link>

      <SearchBar onSearch={(value) => console.log(value)} />

      <div className="flex items-center space-x-2">
        <Dropdown menu={menu} trigger={["hover"]}>
          <div className="relative">
            {renderAvatar()}
        
            <div
              className="w-11 h-11 rounded-full bg-gray-500 text-white  items-center justify-center text-lg font-semibold cursor-pointer hidden"
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;