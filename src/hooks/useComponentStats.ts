"use client";

import { useState, useEffect, useCallback } from "react";

export function useComponentStats(
  componentId: string,
  initialLikes: number = 0,
  initialViews: string = "0"
) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [views, setViews] = useState<string>(initialViews);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const storageKey = `xui_liked_${componentId}`;

  // 1. Initialize from localStorage & fetch fresh stats from Supabase
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check localStorage
    const storedLiked = localStorage.getItem(storageKey) === "true";
    setIsLiked(storedLiked);

    // Fetch fresh stats from API
    fetch(`/api/stats/${componentId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.likes === "number") {
          setLikes(data.likes);
        }
        if (data && data.views !== undefined) {
          setViews(String(data.views));
        }
      })
      .catch(() => {});

    // Listen to cross-component sync event
    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{
        id: string;
        isLiked: boolean;
        likesDelta: number;
      }>;
      if (customEvent.detail && customEvent.detail.id === componentId) {
        setIsLiked(customEvent.detail.isLiked);
        setLikes((prev) => Math.max(0, prev + customEvent.detail.likesDelta));
      }
    };

    window.addEventListener("xui_like_sync", handleSync);
    return () => {
      window.removeEventListener("xui_like_sync", handleSync);
    };
  }, [componentId, storageKey]);

  // 2. Toggle Like function
  const toggleLike = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const nextLiked = !isLiked;
      const delta = nextLiked ? 1 : -1;

      // Optimistic update
      setIsLiked(nextLiked);
      setLikes((prev) => Math.max(0, prev + delta));

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(storageKey, String(nextLiked));

          // Broadcast sync event to other components on page
          window.dispatchEvent(
            new CustomEvent("xui_like_sync", {
              detail: { id: componentId, isLiked: nextLiked, likesDelta: delta },
            })
          );
        } catch {
          // localStorage disabled / private browsing
        }
      }

      // Persist to Supabase
      fetch(`/api/stats/${componentId}?action=${nextLiked ? "like" : "unlike"}`, {
        method: "POST",
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && typeof data.likes === "number") {
            setLikes(data.likes);
          }
        })
        .catch(() => {});
    },
    [componentId, isLiked, storageKey]
  );

  return {
    likes,
    views,
    isLiked,
    toggleLike,
  };
}
