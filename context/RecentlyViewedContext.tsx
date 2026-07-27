"use client";

import { createContext, useCallback, useContext, useMemo, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface RecentlyViewedContextType {
  recentlyViewed: string[];
  addRecentlyViewed: (slug: string) => void;
  isHydrated: boolean;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed, isHydrated] = useLocalStorage<string[]>(
    "accion-recently-viewed",
    []
  );

  const addRecentlyViewed = useCallback((slug: string) => {
    setRecentlyViewed((prev) => {
      if (prev[0] === slug) return prev;
      const filtered = prev.filter((s) => s !== slug);
      return [slug, ...filtered].slice(0, 12);
    });
  }, [setRecentlyViewed]);

  const value = useMemo(
    () => ({ recentlyViewed, addRecentlyViewed, isHydrated }),
    [recentlyViewed, addRecentlyViewed, isHydrated]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error("useRecentlyViewed must be used within RecentlyViewedProvider");
  return context;
}
