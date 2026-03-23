"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, Users, Settings, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HRLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Rough local auth check
    if (pathname !== "/hr/login" && !localStorage.getItem("smarthire_token")) {
      router.push("/hr/login");
    }
  }, [pathname, router]);

  if (pathname === "/hr/login") return <>{children}</>;
  if (!isMounted) return null;

  const nav = [
    { name: "Dashboard", href: "/hr/dashboard", icon: LayoutDashboard },
    { name: "Semantic Search", href: "/hr/search", icon: Search },
    { name: "Admin Setup", href: "/hr/admin", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("smarthire_token");
    localStorage.removeItem("smarthire_user");
    router.push("/hr/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col p-4 fixed h-full shadow-[2px_0_10px_rgba(0,0,0,0.02)] z-10">
        <div className="mb-8 px-2 flex items-center gap-3">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white shadow-sm">S</div>
           <span className="font-bold text-xl tracking-tight text-slate-900">SmartHire</span>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm ${
                  active 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? "text-primary" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors mt-auto font-medium text-sm w-full text-left">
          <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 min-h-screen bg-slate-50">
        {children}
      </main>
    </div>
  );
}
