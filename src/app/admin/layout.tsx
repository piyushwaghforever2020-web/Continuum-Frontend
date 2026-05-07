 "use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = useMemo(() => pathname === "/admin/login", [pathname]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token && !isLoginPage) {
      router.replace("/admin/login");
      setCheckingAuth(false);
      return;
    }

    if (token && isLoginPage) {
      router.replace("/admin/dashboard");
      setCheckingAuth(false);
      return;
    }

    setCheckingAuth(false);
  }, [isLoginPage, router]);

  if (checkingAuth) {
    return null;
  }

  return children;
}
