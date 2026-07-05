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
  /** Manifest category id; used for persisted UI state (e.g. collapse). */
  id: string;
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
 * Custom scope stored by the user (scope content as JSON string for Power Automate paste).
 */
export interface CustomScope {
  id: string;
  name: string;
  data: string;
}
