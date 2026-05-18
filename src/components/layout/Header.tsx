"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Globe, Bell } from "lucide-react";

export function Header() {
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search kanji, grammar..."
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-[#2563eb]/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 ml-6">
          <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Globe className="h-5 w-5 text-slate-500" />
          </button>
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5 text-slate-500" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
