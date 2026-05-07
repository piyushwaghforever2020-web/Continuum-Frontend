"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/axios";
// import DashboardIcon from '/admin/dashboardIcon.svg'

const menuItems = [
  { icon: "/admin/dash_light_icons.svg", activeIcon: "/admin/dashboardIcon.svg", name: "Dashboard", path: "/admin/dashboard", disable: false },
  { icon: "/admin/dach_light_icons3.svg", activeIcon: "/admin/dash_dark_icon3.svg", name: "Participants", path: "/admin/participants", disable: false },
  { icon: "/admin/dach_light_icons2.svg", activeIcon: "/admin/dash_dark_icon2.svg", name: "Cohorts", path: "/admin/cohorts", disable: false },
  { icon: "/admin/dach_light_icons1.svg", activeIcon: "/admin/dash_dark_icon1.svg", name: "Payments", path: "/admin/payments", disable: false },
  { icon: "/admin/dach_light_icon4.svg", activeIcon: "/admin/dash_dark_icon4.svg", name: "Leads", path: "/admin/leads", disable: false },
  // { icon: "/admin/sponsorship.png", name: "Sponsorship / Employer", path: "/admin/sponsorship", disable: true },
];

export default function Sidebar() {
  const { isOpen, isMobile, closeSidebar } = useSidebar();
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/\/$/, "") || "/";

  const router = useRouter();

  useEffect(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [isMobile, pathname]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.replace("/admin/login");
    }
  }, []);

  const handleLogout = async () => {
    console.log("Handling the user logout.....");
    try {
      await api.post("/admin/auth/logout");
      console.log("User logging out....");

      localStorage.removeItem("admin_token");
      router.replace("/admin/login");
      router.refresh();

    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {isMobile && isOpen ? (
        <button
          type="button"
          className="admin-sidebar-overlay"
          aria-label="Close sidebar"
          onClick={closeSidebar}
        />
      ) : null}

      <aside
        className={clsx(
          "admin-sidebar h-screen text-white flex flex-col justify-between",
          !isOpen && "is-closed",
          isMobile && "is-mobile"
        )}
      >
        <div className="flex flex-col items-center">
          <div className="px-6 py-6 font-semibold text-lg tracking-wide flex justify-center w-full">
            <img
              src={isOpen ? "/admin/admin-login-logo.svg" : "/admin/short-icon.png"}
              alt="Logo"
              className={clsx("transition-all", !isOpen && "w-10 h-10 object-contain")}
            />
          </div>

          <nav className="flex flex-col gap-[14px] px-4 mt-9 w-full">
            {menuItems.map((item, index) => {
              const isDashboardItem = item.path === "/admin/dashboard";

              const isActive = item.disable
                ? false
                : isDashboardItem
                  ? normalizedPath === "/admin" ||
                  normalizedPath === "/admin/dashboard" ||
                  normalizedPath.startsWith("/admin/dashboard/")
                  : normalizedPath === item.path ||
                  normalizedPath.startsWith(`${item.path}/`);

              const content = (
                <>
                  {isActive ? (
                    <img
                      src={item.activeIcon}
                      alt=""
                      className={`${item.name === 'Leads' ? 'w-[23px] h-[23px]' : 'w-[20px] h-[20px]'} `}
                    />
                  ) : (
                    <img
                      src={item.icon}
                      alt=""
                      className={`${item.name === 'Leads' ? 'w-[23px] h-[23px]' : 'w-[20px] h-[20px]'}  group-hover:brightness-0 `}
                    />
                  )}

                  <span className="admin-sidebar-name">{item.name}</span>
                </>
              );

              if (item.disable) {
                return (
                  <div
                    key={index}
                    className={clsx(
                      "group text-left px-4 py-2 flex gap-2 rounded-md text-[14px] leading-[20px] font-medium",
                      "cursor-not-allowed text-[#D9D5DD] group-hover:brightness-0 "
                    )}
                  >
                    {content}
                  </div>
                );
              }

              // ✅ Normal clickable link
              return (
                <Link
                  key={index}
                  href={item.path}
                  onClick={() => {
                    if (isMobile) {
                      closeSidebar();
                    }
                  }}
                  className={clsx(
                    "group text-left px-4 py-2 flex gap-2 rounded-md text-[14px] leading-[20px] font-medium items-center",
                    "hover:bg-[var(--color-warmCreamy)] hover:text-[var(--color-burgundy)] transition-all admin-nav-item",
                    isActive && "bg-[var(--color-warmCreamy)] text-[var(--color-burgundy)]",
                    !isOpen && "justify-center"
                  )}
                >
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-6 pb-16 flex justify-center">
          <button
            onClick={handleLogout}
            className={clsx(
              "rounded-[14px] text-[14px] font-medium flex items-center justify-center transition-all admin-logout-button",
              isOpen ? "w-[176px] h-[44px] bg-[var(--color-warmCreamy)]  gap-2" : "w-[44px] h-[44px]"
            )}
          >
            {/* <img
              src="/admin/logout.png"
              alt="Logout"
            // className={clsx("object-contain", isOpen ? "w-4 h-4" : "w-5 h-5")}
            /> */}
            {isOpen && <span className="text-[var(--color-burgundy)]">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
