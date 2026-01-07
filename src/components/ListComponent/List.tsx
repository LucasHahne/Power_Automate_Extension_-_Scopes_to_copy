import React, { useState } from "react";
import ListHeader from "../ListComponent/ListHeader";
import ListContent from "../ListComponent/ListContent";
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
      <ListHeader
        title={title}
        gradient={gradient}
        isCollapsed={isCollapsed}
        onToggle={toggleCollapse}
      />
      {!isCollapsed && (
        <ListContent
          items={items}
          onItemClick={onItemClick}
          onCopyClick={onCopyClick}
        />
      )}
    </div>
  );
};

export default List;
