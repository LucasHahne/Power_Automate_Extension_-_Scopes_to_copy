import React from "react";

/**
 * Represents an item in a list with an icon and optional data
 */
export interface ListItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  data?: unknown;
  fileType?: "json" | "txt";
}

/**
 * Represents a category of snippets with items
 */
export interface SnippetCategory {
  title: string;
  gradient: string;
  items: ListItem[];
}

/**
 * Category entry in the snippet manifest (data-only, no JSX)
 */
export interface CategoryManifestItem {
  id: string;
  title: string;
  gradient: string;
  iconKey: string;
}

/**
 * Snippet entry in the manifest (data-only; dataPath resolved by loader)
 */
export interface SnippetManifestItem {
  id: string;
  categoryId: string;
  name: string;
  iconKey: string;
  dataPath: string;
  fileType: "json" | "txt";
}

/**
 * Option definition for the options section (extensible for future options).
 * storageKey is used for chrome.storage.local; afterSet runs after value is persisted (e.g. notify content script).
 */
export interface OptionDefinition {
  id: string;
  label: string;
  storageKey: string;
  afterSet?: (value: boolean) => Promise<void>;
}
