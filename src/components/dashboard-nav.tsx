
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  GitPullRequest, 
  ShieldAlert, 
  Settings, 
  History, 
  Package,
  FileCode,
  Lock
} from "lucide-react";

const NAV_ITEMS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Repositories', href: '/dashboard/repos', icon: Package },
  { name: 'Pull Requests', href: '/dashboard/prs', icon: GitPullRequest },
  { name: 'Findings', href: '/dashboard/findings', icon: ShieldAlert },
  { name: 'Policies', href: '/dashboard/policies', icon: Lock },
  { name: 'Audit Logs', href: '/dashboard/audit', icon: History },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 bg-sidebar min-h-screen p-6 flex flex-col gap-8">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center glow-primary">
          <Image 
            src="/logo.jpeg" 
            alt="SecureFlow Logo" 
            width={28} 
            height={28} 
            className="object-contain"
          />
        </div>
        <span className="font-headline font-bold text-lg tracking-tight">SecureFlow</span>
      </div>
      
      <nav className="flex flex-col gap-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">Main Menu</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-white/5 px-8 flex items-center justify-between glass-card sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          <span className="text-white font-medium">User</span> / Acme Corp
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[10px] font-bold">
          JD
        </div>
      </div>
    </header>
  );
}

import { Search } from "lucide-react";import Image from "next/image";

