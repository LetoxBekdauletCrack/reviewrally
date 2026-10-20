"use client";

import React, { useState } from "react";
import {
  Building2,
  ChevronDown,
  Bell,
  Search,
  CheckCircle2,
} from "lucide-react";

interface TopbarProps {
  currentBusiness?: string;
  onBusinessChange?: (biz: string) => void;
}

const BUSINESSES = [
  { id: "biz-1", name: "Bistro Belle (Downtown)", reviewsCount: 342 },
  { id: "biz-2", name: "The Grand Grill (Westside)", reviewsCount: 158 },
  { id: "biz-3", name: "L'Aroma Coffee Lounge", reviewsCount: 89 },
];

export function Topbar({
  currentBusiness = "biz-1",
  onBusinessChange,
}: TopbarProps) {
  const [selectedBiz, setSelectedBiz] = useState(currentBusiness);
  const [isOpen, setIsOpen] = useState(false);

  const active = BUSINESSES.find((b) => b.id === selectedBiz) || BUSINESSES[0];

  const handleSelect = (id: string) => {
    setSelectedBiz(id);
    setIsOpen(false);
    onBusinessChange?.(id);
  };

  return (
    <header className="h-16 border-b border-border/60 bg-card/30 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Location / Business Switcher */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-border bg-card/80 hover:bg-accent text-sm font-medium transition-colors"
          >
            <Building2 className="h-4 w-4 text-primary" />
            <span className="font-semibold">{active.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-xl border border-border/80 bg-card p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 text-xs font-semibold uppercase text-muted-foreground">
                Select Workspace / Location
              </div>
              <div className="space-y-1 mt-1">
                {BUSINESSES.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelect(b.id)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-sm text-left hover:bg-muted/70 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-foreground">{b.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {b.reviewsCount} total reviews
                      </div>
                    </div>
                    {b.id === selectedBiz && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Real-time reputation sync active</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews or keywords..."
            className="h-9 w-60 rounded-lg bg-card/60 border border-border/80 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button className="h-9 w-9 rounded-lg border border-border/80 bg-card/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-border/60">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
            RR
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold leading-tight">Daulet Bekdaulet</div>
            <div className="text-[10px] text-muted-foreground">Owner / Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
}
