"use client";

import { useState, useMemo } from "react";
import { useTopPicks } from "@/context/TopPicksContext";
import { SearchBar } from "./SearchBar";
import { CatalogCard } from "./CatalogCard";

export function CatalogGrid() {
  const { allProducts: rawProducts, selectedPicks, addPick, removePick, isSelected } =
    useTopPicks();
  const [search, setSearch] = useState("");
  const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set());

  // Deduplicate products to prevent React key conflicts
  const allProducts = useMemo(() => {
    const seen = new Set<string>();
    return rawProducts.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [rawProducts]);

  // Client-side search filtering
  const searchFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q)
    );
  }, [allProducts, search]);

  const flagOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of searchFiltered) {
      if (p.flag) counts.set(p.flag, (counts.get(p.flag) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([flag, count]) => ({ flag, count }));
  }, [searchFiltered]);

  const toggleFlag = (flag: string) => {
    setActiveFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  };

  const filtered = searchFiltered.filter((p) => {
    if (activeFlags.size > 0 && !activeFlags.has(p.flag)) return false;
    return true;
  });

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
      {flagOptions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {flagOptions.map(({ flag, count }) => (
            <button
              key={flag}
              onClick={() => toggleFlag(flag)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                activeFlags.has(flag)
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {flag} ({count})
            </button>
          ))}
          {activeFlags.size > 0 && (
            <button
              onClick={() => setActiveFlags(new Set())}
              className="rounded-full px-2.5 py-1 text-xs font-medium text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 [&>*]:max-w-[200px]">
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
          {search || activeFlags.size > 0
            ? "No cards match the current filters"
            : "No cards available"}
        </p>
      )}
    </div>
  );
}
