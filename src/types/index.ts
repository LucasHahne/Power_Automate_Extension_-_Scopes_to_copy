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
