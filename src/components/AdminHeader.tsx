"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { api } from "@/lib/axios";
import { FiBell, FiChevronDown, FiLogOut } from "react-icons/fi";

type AdminHeaderProps = {
  eyebrow?: string;
  title?: string;
};

export default function Header({}: AdminHeaderProps) {
  const { isMobile, isOpen, openSidebar, closeSidebar, toggleSidebar } = useSidebar();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSidebarToggle = () => {
    if (isMobile) {
      if (isOpen) {
        closeSidebar();
        return;
      }

      openSidebar();
      return;
    }

    toggleSidebar();
  };

  const handleLogout = async () => {
    try {
      await api.post("/admin/auth/logout");
      localStorage.removeItem("admin_token");
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleOutsideClick = () => setIsMenuOpen(false);
    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button
          type="button"
          onClick={handleSidebarToggle}
          className="admin-icon-button"
          aria-label="Toggle sidebar"
        >
          <img src="/admin/header-sidebar.png" alt="" />
        </button>
      </div>

      <div className="admin-header__right">
        <button
          type="button"
          className="admin-icon-button admin-icon-button--plain relative"
          aria-label="Notifications"
        >
          <FiBell size={15} />
          <span className="admin-notification-dot" />
        </button>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            className="admin-profile"
            aria-label="Admin profile"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
          >
            <div className="admin-profile__avatar">A</div>
            <p className="admin-profile__name">Admin</p>
            <FiChevronDown
              size={12}
              color="#70688c"
              style={{
                transition: "transform 0.2s ease",
                transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>

          {isMenuOpen && (
            <div className="admin-profile-menu">
              <button
                type="button"
                className="admin-profile-menu__item"
                onClick={handleLogout}
              >
                <FiLogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
