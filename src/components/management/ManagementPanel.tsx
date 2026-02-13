"use client";

import { SelectedPicksList } from "./SelectedPicksList";
import { CatalogGrid } from "./CatalogGrid";

export function ManagementPanel() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-white px-6 py-4">
        <h1 className="text-lg font-bold text-gray-900">
          Top Picks Manager
        </h1>
        <p className="text-sm text-gray-500">
          Select and reorder cards for the Discover tab carousel
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-col gap-6">
          <SelectedPicksList />
          <div className="border-t pt-6">
            <CatalogGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
