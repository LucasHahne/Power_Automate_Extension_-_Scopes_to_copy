import React, { useState } from "react";
import Header from "./Header";
import Content from "./Content";
import type { ListItem } from "../../types";

interface ListProps {
  title: string;
  gradient?: string;
  items: ListItem[];
  onItemClick?: (item: ListItem) => void;
  onCopyClick?: (item: ListItem) => void;
  defaultCollapsed?: boolean;
  /** When set with `onCollapsedChange`, collapse state is controlled by the parent (e.g. persisted). */
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const List: React.FC<ListProps> = ({
  title,
  gradient,
  items,
  onItemClick,
  onCopyClick,
  defaultCollapsed = true,
  isCollapsed: isCollapsedControlled,
  onCollapsedChange,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isControlled =
    typeof isCollapsedControlled === "boolean" && !!onCollapsedChange;
  const isCollapsed = isControlled
    ? isCollapsedControlled
    : internalCollapsed;

  const toggleCollapse = () => {
    if (isControlled) {
      onCollapsedChange(!isCollapsed);
    } else {
      setInternalCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="w-full overflow-auto shadow-md bg-white rounded-sm">
      <Header
        title={title}
        gradient={gradient}
        isCollapsed={isCollapsed}
        onToggle={toggleCollapse}
      />
      {!isCollapsed && (
        <Content
          items={items}
          onItemClick={onItemClick}
          onCopyClick={onCopyClick}
        />
      )}
    </div>
  );
};

export default List;
