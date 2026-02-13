"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Product } from "@/lib/types";

interface TopPicksContextValue {
  allProducts: Product[];
  selectedPicks: Product[];
  addPick: (product: Product) => void;
  removePick: (productId: string) => void;
  reorderPicks: (activeId: string, overId: string) => void;
  isSelected: (productId: string) => boolean;
}

const TopPicksContext = createContext<TopPicksContextValue | null>(null);

export function TopPicksProvider({
  initialProducts,
  children,
}: {
  initialProducts: Product[];
  children: ReactNode;
}) {
  const [allProducts] = useState<Product[]>(initialProducts);
  const [selectedPicks, setSelectedPicks] = useState<Product[]>([]);

  const addPick = useCallback((product: Product) => {
    setSelectedPicks((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removePick = useCallback((productId: string) => {
    setSelectedPicks((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const reorderPicks = useCallback((activeId: string, overId: string) => {
    setSelectedPicks((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === activeId);
      const newIndex = prev.findIndex((p) => p.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return updated;
    });
  }, []);

  const isSelected = useCallback(
    (productId: string) => selectedPicks.some((p) => p.id === productId),
    [selectedPicks]
  );

  return (
    <TopPicksContext.Provider
      value={{
        allProducts,
        selectedPicks,
        addPick,
        removePick,
        reorderPicks,
        isSelected,
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
