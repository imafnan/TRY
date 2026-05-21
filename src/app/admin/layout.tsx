"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Award,
  PlusCircle,
  LogOut,
  Menu,
  X,
  Building2,
  UserCircle,
  ImageIcon,
  Images,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/store/authStore";
import { cn } from "@/utils";

const sidebarLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/certificates", icon: Award, label: "Certificates" },
  { href: "/admin/certificates/create", icon: PlusCircle, label: "Create Certificate" },
  { href: "/admin/account", icon: UserCircle, label: "Account" },
  { href: "/admin/site-settings/hero", icon: ImageIcon, label: "Hero banner" },
  { href: "/admin/site-settings/gallery", icon: Images, label: "Gallery" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d2353] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#0d2353] text-white flex flex-col transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Building2 size={22} className="text-blue-300" />
            <div>
              <p className="font-bold text-sm">Swapnopuri</p>
              <p className="text-white/50 text-xs">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/70 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150",
                pathname === href
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-xs text-white/40 hover:text-white/70 mt-1"
          >
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu size={22} />
          </button>
          <h2 className="font-semibold text-gray-800 text-sm md:text-base">
            Admin Dashboard
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">
              Logged in as Admin
            </span>
            <div className="w-8 h-8 bg-[#0d2353] rounded-full flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
