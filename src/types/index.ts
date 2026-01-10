import React from "react";

/**
 * Represents an item in a list with an icon and optional data
 */
export interface ListItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  jsonData?: unknown;
  category?: string;
}

/**
 * Represents a category of snippets with items
 */
export interface SnippetCategory {
  title: string;
  gradient: string;
  items: ListItem[];
}
