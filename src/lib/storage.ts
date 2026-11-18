"use client";

import { useMemo, useSyncExternalStore } from "react";

const favoritesKey = "what-to-cook:favorites";
const historyKey = "what-to-cook:history";
const updateEvent = "what-to-cook:storage";
const empty = "[]";

export interface HistoryEntry {
  recipeId: string;
  name: string;
  date: string;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(updateEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(updateEvent, callback);
  };
}

function read(key: string) {
  try {
    return window.localStorage.getItem(key) ?? empty;
  } catch {
    return empty;
  }
}

function parse<T>(raw: string, isEntry: (value: unknown) => value is T): T[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter(isEntry) : [];
  } catch {
    return [];
  }
}

function write(key: string, entries: unknown[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(entries));
    window.dispatchEvent(new Event(updateEvent));
    return true;
  } catch {
    return false;
  }
}

function useEntries<T>(key: string, isEntry: (value: unknown) => value is T) {
  const raw = useSyncExternalStore(subscribe, () => read(key), () => empty);
  return useMemo(() => parse(raw, isEntry), [raw, isEntry]);
}

const isFavorite = (value: unknown): value is string => typeof value === "string";

function isHistoryEntry(value: unknown): value is HistoryEntry {
  return typeof value === "object" && value !== null &&
    "recipeId" in value && typeof value.recipeId === "string" &&
    "name" in value && typeof value.name === "string" &&
    "date" in value && typeof value.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.date);
}

export function useFavorites() {
  return useEntries(favoritesKey, isFavorite);
}

export function useHistory() {
  return useEntries(historyKey, isHistoryEntry);
}

export function toggleFavorite(id: string) {
  const items = parse(read(favoritesKey), isFavorite);
  return write(favoritesKey, items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
}

export function recordCooking(recipeId: string, name: string) {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const date = `${now.getFullYear()}-${month}-${day}`;
  const items = parse(read(historyKey), isHistoryEntry);
  if (items.some((item) => item.recipeId === recipeId && item.date === date)) return true;
  return write(historyKey, [{ recipeId, name, date }, ...items]);
}