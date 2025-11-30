interface ListItem {
  name: string;
  icon: React.ReactNode;
  id?: string;
}

interface ListProps {
  items: ListItem[];
  onItemClick?: (item: ListItem) => void;
  onCopyClick?: (item: ListItem) => void;
}

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
    />
  </svg>
);

const ListContent: React.FC<ListProps> = ({
  items,
  onItemClick,
  onCopyClick,
}) => {
  const handleCopyClick = (e: React.MouseEvent, item: ListItem) => {
    e.stopPropagation();
    onCopyClick?.(item);
  };

  return (
    <div className="w-full">
      <ul className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <li
            key={item.id || index}
            onClick={() => onItemClick?.(item)}
            className="flex items-center gap-3 px-4 py-1 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="shrink-0 text-gray-600 rounded-sm">{item.icon}</div>
            <span className="text-sm font-medium text-gray-900 flex-1">
              {item.name}
            </span>
            <button
              onClick={(e) => handleCopyClick(e, item)}
              className="shrink-0 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              aria-label="Copy"
            >
              <CopyIcon />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListContent;
