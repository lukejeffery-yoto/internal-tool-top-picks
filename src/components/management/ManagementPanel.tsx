"use client";

import { useState } from "react";
import pkg from "../../../package.json";
import { RegionTabs } from "./RegionTabs";
import { PublishBar } from "./PublishBar";
import { SelectedPicksList } from "./SelectedPicksList";
import { CatalogGrid } from "./CatalogGrid";
import { HistoryPanel } from "./HistoryPanel";
import { useTopPicks } from "@/context/TopPicksContext";

export function ManagementPanel() {
  const { activeRegion, allProducts } = useTopPicks();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-baseline justify-between">
          <h1 className="text-lg font-bold text-gray-900">
            Top Picks Manager
          </h1>
          <span className="text-xs text-gray-400">v{pkg.version}</span>
        </div>
        <p className="text-sm text-gray-500">
          Select and reorder cards for the Discover tab carousel
        </p>
      </div>
      <RegionTabs />
      <PublishBar onOpenHistory={() => setShowHistory(true)} />
      <div className="flex-1 overflow-y-auto p-6">
        {allProducts.length === 0 ? (
          <div className="flex h-40 items-center justify-center">
            <p className="text-sm text-gray-400">
              No products available for {activeRegion}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <SelectedPicksList />
            <div className="border-t pt-6">
              <CatalogGrid />
            </div>
          </div>
        )}
      </div>
      {showHistory && (
        <HistoryPanel onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}
