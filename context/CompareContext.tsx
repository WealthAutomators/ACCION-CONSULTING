"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  ReactNode,
} from "react";
import { Product } from "@/types";
import { getProductById } from "@/data/products";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const MAX_COMPARE = 4;

interface CompareContextType {
  compareIds: string[];
  compareProducts: Product[];
  toggleCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  isHydrated: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds, isHydrated] = useLocalStorage<string[]>(
    "accion-compare",
    []
  );

  const compareProducts = useMemo(
    () =>
      compareIds
        .map((id) => getProductById(id))
        .filter((p): p is Product => p !== undefined),
    [compareIds]
  );

  const toggleCompare = useCallback(
    (productId: string) => {
      setCompareIds((prev) => {
        if (prev.includes(productId)) return prev.filter((id) => id !== productId);
        if (prev.length >= MAX_COMPARE) return [...prev.slice(1), productId];
        return [...prev, productId];
      });
    },
    [setCompareIds]
  );

  const isInCompare = useCallback(
    (productId: string) => compareIds.includes(productId),
    [compareIds]
  );

  const clearCompare = useCallback(() => setCompareIds([]), [setCompareIds]);

  const value = useMemo(
    () => ({
      compareIds,
      compareProducts,
      toggleCompare,
      isInCompare,
      clearCompare,
      isHydrated,
    }),
    [compareIds, compareProducts, toggleCompare, isInCompare, clearCompare, isHydrated]
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within CompareProvider");
  return context;
}
