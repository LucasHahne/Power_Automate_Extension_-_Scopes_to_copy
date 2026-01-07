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
}

const List: React.FC<ListProps> = ({
  title,
  gradient,
  items,
  onItemClick,
  onCopyClick,
  defaultCollapsed = true,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
