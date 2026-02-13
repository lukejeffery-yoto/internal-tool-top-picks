"use client";

import { useState } from "react";
import { DiscoverView } from "./DiscoverView";
import { ExpandedView } from "./ExpandedView";

export function PhonePreview() {
  const [view, setView] = useState<"discover" | "expanded">("discover");

  return (
    <div className="flex flex-col items-center gap-4">
      {/* View toggle */}
      <div className="flex rounded-lg bg-gray-200 p-1">
        <button
          onClick={() => setView("discover")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            view === "discover"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Discover Tab
        </button>
        <button
          onClick={() => setView("expanded")}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            view === "expanded"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Expanded View
        </button>
      </div>

      {/* Phone frame */}
      <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[40px] border-[8px] border-gray-900 bg-[#1a1a1a] shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-gray-900" />

        {/* Screen content */}
        <div className="h-full w-full overflow-hidden">
          {view === "discover" ? <DiscoverView /> : <ExpandedView />}
        </div>
      </div>
    </div>
  );
}
