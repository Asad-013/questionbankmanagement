"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "ilet-bookmarks";

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setBookmarks(JSON.parse(stored));
            }
        } catch {
            // ignore parse errors
        }
        setIsLoaded(true);
    }, []);

    const saveBookmarks = useCallback((ids: string[]) => {
        setBookmarks(ids);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch {
            // ignore storage errors
        }
    }, []);

    const toggleBookmark = useCallback(
        (id: string) => {
            setBookmarks((prev) => {
                const next = prev.includes(id)
                    ? prev.filter((b) => b !== id)
                    : [...prev, id];
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                } catch {
                    // ignore
                }
                return next;
            });
        },
        []
    );

    const isBookmarked = useCallback(
        (id: string) => bookmarks.includes(id),
        [bookmarks]
    );

    const clearBookmarks = useCallback(() => {
        saveBookmarks([]);
    }, [saveBookmarks]);

    return {
        bookmarks,
        toggleBookmark,
        isBookmarked,
        clearBookmarks,
        isLoaded,
    };
}
