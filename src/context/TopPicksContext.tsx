"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { Product, PickVersion } from "@/lib/types";
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

  // Draft vs published
  publishedProductIds: string[] | null;
  lastPublishedAt: string | null;
  hasUnpublishedChanges: boolean;

  // Publish
  isPublishing: boolean;
  publishPicks: (note?: string, publishedBy?: string) => Promise<void>;

  // History
  history: PickVersion[];
  isLoadingHistory: boolean;
  loadHistory: () => Promise<void>;

  // Restore
  isRestoring: boolean;
  restoreVersion: (versionId: number) => Promise<void>;
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

  // Published state tracking
  const [publishedByRegion, setPublishedByRegion] = useState<
    Record<string, string[] | null>
  >({});
  const [lastPublishedAtByRegion, setLastPublishedAtByRegion] = useState<
    Record<string, string | null>
  >({});
  const [isPublishing, setIsPublishing] = useState(false);

  // History state
  const [history, setHistory] = useState<PickVersion[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Restore state
  const [isRestoring, setIsRestoring] = useState(false);

  const allProducts = productsByRegion[activeRegion] || [];
  const selectedPicks = picksByRegion[activeRegion] || [];
  const publishedProductIds = publishedByRegion[activeRegion] ?? null;
  const lastPublishedAt = lastPublishedAtByRegion[activeRegion] ?? null;

  const hasUnpublishedChanges = useMemo(() => {
    const draftIds = selectedPicks.map((p) => p.id);
    const pubIds = publishedByRegion[activeRegion];
    if (pubIds === null || pubIds === undefined) return draftIds.length > 0;
    if (draftIds.length !== pubIds.length) return true;
    return draftIds.some((id, i) => id !== pubIds[i]);
  }, [selectedPicks, publishedByRegion, activeRegion]);

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
          setPublishedByRegion((prev) => ({
            ...prev,
            [region]: data.publishedProductIds ?? null,
          }));
          setLastPublishedAtByRegion((prev) => ({
            ...prev,
            [region]: data.lastPublishedAt ?? null,
          }));
          setLoadedRegions((prev) => new Set(prev).add(region));
        }
      } catch {
        // Silently fail — picks will just be empty
      }
      setIsLoading(false);
    },
    [productsByRegion, loadedRegions]
  );

  // Save picks to DB (draft auto-save)
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

  // Publish current draft
  const publishPicksAction = useCallback(
    async (note?: string, publishedBy?: string) => {
      setIsPublishing(true);
      try {
        const res = await fetch(`/api/picks/${activeRegion}/publish`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ note, publishedBy }),
        });
        if (res.ok) {
          const currentIds = (picksByRegion[activeRegion] || []).map(
            (p) => p.id
          );
          setPublishedByRegion((prev) => ({
            ...prev,
            [activeRegion]: currentIds,
          }));
          setLastPublishedAtByRegion((prev) => ({
            ...prev,
            [activeRegion]: new Date().toISOString(),
          }));
        } else {
          const err = await res.json().catch(() => ({}));
          console.error("Publish failed:", res.status, err);
        }
      } catch (err) {
        console.error("Publish error:", err);
      }
      setIsPublishing(false);
    },
    [activeRegion, picksByRegion]
  );

  // Load history for active region
  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/picks/${activeRegion}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.versions);
      }
    } catch {
      // Silently fail
    }
    setIsLoadingHistory(false);
  }, [activeRegion]);

  // Restore a historical version to draft
  const restoreVersion = useCallback(
    async (versionId: number) => {
      setIsRestoring(true);
      try {
        const res = await fetch(`/api/picks/${activeRegion}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ versionId }),
        });
        if (res.ok) {
          const data = await res.json();
          const regionProducts = productsByRegion[activeRegion] || [];
          const picks = (data.productIds as string[])
            .map((id) => regionProducts.find((p) => p.id === id))
            .filter((p): p is Product => !!p);
          setPicksByRegion((prev) => ({ ...prev, [activeRegion]: picks }));
        }
      } catch {
        // Silently fail
      }
      setIsRestoring(false);
    },
    [activeRegion, productsByRegion]
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
        publishedProductIds,
        lastPublishedAt,
        hasUnpublishedChanges,
        isPublishing,
        publishPicks: publishPicksAction,
        history,
        isLoadingHistory,
        loadHistory,
        isRestoring,
        restoreVersion,
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
