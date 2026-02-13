"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/lib/types";
import { RegionCode } from "@/lib/data";
import { Region } from "@/lib/mock-products";

interface TopPicksContextValue {
  regions: Region[];
  activeRegion: RegionCode;
  setActiveRegion: (region: RegionCode) => void;
  allProducts: Product[];
  selectedPicks: Product[];
  addPick: (product: Product) => void;
  removePick: (productId: string) => void;
  reorderPicks: (activeId: string, overId: string) => void;
  isSelected: (productId: string) => boolean;
  isSaving: boolean;
  isLoading: boolean;
}

const TopPicksContext = createContext<TopPicksContextValue | null>(null);

export function TopPicksProvider({
  regionList,
  productsByRegion,
  children,
}: {
  regionList: Region[];
  productsByRegion: Record<RegionCode, Product[]>;
  children: ReactNode;
}) {
  const [activeRegion, setActiveRegionRaw] = useState<RegionCode>("UK");
  const [picksByRegion, setPicksByRegion] = useState<
    Record<string, Product[]>
  >({});
  const [loadedRegions, setLoadedRegions] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const allProducts = productsByRegion[activeRegion] || [];
  const selectedPicks = picksByRegion[activeRegion] || [];

  // Load picks from DB when switching regions
  const loadRegionPicks = useCallback(
    async (region: RegionCode) => {
      if (loadedRegions.has(region)) return;
      setIsLoading(true);
      try {
        const res = await fetch(`/api/picks/${region}`);
        if (res.ok) {
          const data = await res.json();
          const productIds: string[] = data.productIds || [];
          const regionProducts = productsByRegion[region] || [];
          const picks = productIds
            .map((id) => regionProducts.find((p) => p.id === id))
            .filter((p): p is Product => !!p);
          setPicksByRegion((prev) => ({ ...prev, [region]: picks }));
          setLoadedRegions((prev) => new Set(prev).add(region));
        }
      } catch {
        // Silently fail — picks will just be empty
      }
      setIsLoading(false);
    },
    [productsByRegion, loadedRegions]
  );

  // Save picks to DB
  const savePicks = useCallback(
    async (region: RegionCode, picks: Product[]) => {
      setIsSaving(true);
      try {
        await fetch(`/api/picks/${region}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: picks.map((p) => p.id) }),
        });
      } catch {
        // Silently fail
      }
      setIsSaving(false);
    },
    []
  );

  const setActiveRegion = useCallback(
    (region: RegionCode) => {
      setActiveRegionRaw(region);
      loadRegionPicks(region);
    },
    [loadRegionPicks]
  );

  // Load initial region on mount
  useEffect(() => {
    loadRegionPicks(activeRegion);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const addPick = useCallback(
    (product: Product) => {
      setPicksByRegion((prev) => {
        const current = prev[activeRegion] || [];
        if (current.some((p) => p.id === product.id)) return prev;
        const updated = [...current, product];
        savePicks(activeRegion, updated);
        return { ...prev, [activeRegion]: updated };
      });
    },
    [activeRegion, savePicks]
  );

  const removePick = useCallback(
    (productId: string) => {
      setPicksByRegion((prev) => {
        const updated = (prev[activeRegion] || []).filter(
          (p) => p.id !== productId
        );
        savePicks(activeRegion, updated);
        return { ...prev, [activeRegion]: updated };
      });
    },
    [activeRegion, savePicks]
  );

  const reorderPicks = useCallback(
    (activeId: string, overId: string) => {
      setPicksByRegion((prev) => {
        const current = prev[activeRegion] || [];
        const oldIndex = current.findIndex((p) => p.id === activeId);
        const newIndex = current.findIndex((p) => p.id === overId);
        if (oldIndex === -1 || newIndex === -1) return prev;
        const updated = [...current];
        const [moved] = updated.splice(oldIndex, 1);
        updated.splice(newIndex, 0, moved);
        savePicks(activeRegion, updated);
        return { ...prev, [activeRegion]: updated };
      });
    },
    [activeRegion, savePicks]
  );

  const isSelected = useCallback(
    (productId: string) =>
      (picksByRegion[activeRegion] || []).some((p) => p.id === productId),
    [picksByRegion, activeRegion]
  );

  return (
    <TopPicksContext.Provider
      value={{
        regions: regionList,
        activeRegion,
        setActiveRegion,
        allProducts,
        selectedPicks,
        addPick,
        removePick,
        reorderPicks,
        isSelected,
        isSaving,
        isLoading,
      }}
    >
      {children}
    </TopPicksContext.Provider>
  );
}

export function useTopPicks() {
  const ctx = useContext(TopPicksContext);
  if (!ctx)
    throw new Error("useTopPicks must be used within TopPicksProvider");
  return ctx;
}
