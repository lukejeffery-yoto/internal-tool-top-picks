"use client";

import { useTopPicks } from "@/context/TopPicksContext";

export function RegionTabs() {
  const { regions, activeRegion, setActiveRegion, isSaving, isLoading } =
    useTopPicks();

  return (
    <div className="flex items-center gap-1 border-b bg-white px-6 py-2">
      {regions.map((region) => {
        const isActive = activeRegion === region.code;
        const hasProducts = true; // FR will show as empty
        return (
          <button
            key={region.code}
            onClick={() => setActiveRegion(region.code)}
            className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : hasProducts
                  ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            {region.code}
          </button>
        );
      })}
      <div className="ml-auto flex items-center gap-2">
        {isLoading && (
          <span className="text-xs text-gray-400">Loading...</span>
        )}
        {isSaving && (
          <span className="text-xs text-gray-400">Saving...</span>
        )}
      </div>
    </div>
  );
}
