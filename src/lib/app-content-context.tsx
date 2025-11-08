"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AppContent } from "./app-content";
import { defaultAppContent, loadAppContent, saveAppContent } from "./app-content";

export type AppContentContextValue = {
  content: AppContent;
  setContent: React.Dispatch<React.SetStateAction<AppContent>>;
  refresh: () => void;
};

const AppContentContext = createContext<AppContentContextValue | undefined>(undefined);

export function AppContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContentState] = useState<AppContent>(defaultAppContent);

  useEffect(() => {
    setContentState(loadAppContent());

    if (typeof window === "undefined") return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "appContent") {
        setContentState(loadAppContent());
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setContent = useCallback<React.Dispatch<React.SetStateAction<AppContent>>>((updater) => {
    setContentState((prev) => {
      const next = typeof updater === "function" ? (updater as (p: AppContent) => AppContent)(prev) : updater;
      saveAppContent(next);
      return next;
    });
  }, []);

  const refresh = useCallback(() => {
    setContentState(loadAppContent());
  }, []);

  const value = useMemo<AppContentContextValue>(() => ({ content, setContent, refresh }), [content, setContent, refresh]);

  return <AppContentContext.Provider value={value}>{children}</AppContentContext.Provider>;
}

export function useAppContent() {
  const ctx = useContext(AppContentContext);
  if (!ctx) throw new Error("useAppContent must be used within an AppContentProvider");
  return ctx;
}
