"use client";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import WalletIcon from "@heroicons/react/24/outline/WalletIcon";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const currentPath = usePathname();
  const [userEmail, setUserEmail] = useState("");

  const handleLogout = async () => {
    localStorage.removeItem("walletDetails");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };
  useEffect(() => {
    const userEmailDetail = JSON.parse(
      localStorage.getItem("userEmail") as string
    );
    setUserEmail(userEmailDetail);
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <WalletIcon className="w-8 h-8 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-800">UQPAY</h2>
          </div>

          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Welcome, <span>{userEmail}</span>
            </p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-4">
          <Link
            href="/dashboard"
            className={cn(
              "block p-3 rounded-lg text-gray-700 font-medium transition-colors",
              currentPath === "/dashboard"
                ? "bg-blue-500 text-white"
                : "hover:bg-blue-100 hover:text-gray-900"
            )}
          >
            Address List
          </Link>

          {/* <Link
        href="/dashboard/create-address"
        className={cn(
          "block p-3 rounded-lg text-gray-700 font-medium transition-colors",
          currentPath === "/dashboard/create-address"
            ? "bg-blue-500 text-white"
            : "hover:bg-blue-100 hover:text-gray-900"
        )}
      >
        Create Address
      </Link> */}

          <button
            onClick={handleLogout}
            className="block w-full text-left p-3 rounded-lg font-medium text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
