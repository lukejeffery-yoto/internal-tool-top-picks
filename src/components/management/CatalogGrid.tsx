"use client";

import { useState } from "react";
import { useTopPicks } from "@/context/TopPicksContext";
import { SearchBar } from "./SearchBar";
import { CatalogCard } from "./CatalogCard";

export function CatalogGrid() {
  const { allProducts, selectedPicks, addPick, removePick, isSelected } =
    useTopPicks();
  const [search, setSearch] = useState("");

  const filtered = allProducts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">
          Available Cards
        </h2>
        <span className="text-xs text-gray-500">
          {selectedPicks.length} selected &middot; {filtered.length} of{" "}
          {allProducts.length} shown
        </span>
      </div>
      <SearchBar value={search} onChange={setSearch} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => {
          const selected = isSelected(product.id);
          return (
            <CatalogCard
              key={product.id}
              product={product}
              isSelected={selected}
              onToggle={() =>
                selected ? removePick(product.id) : addPick(product)
              }
            />
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">
          No cards match &ldquo;{search}&rdquo;
        </p>
      )}
    </div>
  );
}
