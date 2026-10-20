"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  CreditCard,
  Settings,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Reviews", href: "/reviews", icon: MessageSquare },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border/60 bg-card/40 backdrop-blur-xl flex flex-col justify-between p-4 h-screen sticky top-0">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-primary/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              ReviewRally
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                B2B Reputation
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/25 shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform group-hover:scale-110",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Pro Badge / Plan Card */}
      <div className="p-4 rounded-xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Pro Plan Active
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          AI Auto-Reply engine enabled. Unlimited draft suggestions active.
        </p>
        <Link
          href="/billing"
          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
        >
          Manage Subscription &rarr;
        </Link>
      </div>
    </aside>
  );
}
