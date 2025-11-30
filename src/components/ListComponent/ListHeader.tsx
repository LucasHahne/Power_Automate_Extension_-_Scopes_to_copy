import React from "react";

interface ListHeaderProps {
  title: string;
  gradient?: string;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const ChevronIcon: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={`w-5 h-5 transition-transform ${
      isCollapsed ? "" : "rotate-180"
    }`}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

const ListHeader: React.FC<ListHeaderProps> = ({
  title,
  gradient = "from-blue-500 to-purple-600",
  isCollapsed = false,
  onToggle,
}) => {
  return (
    <div
      className={`bg-linear-to-r ${gradient} px-4 py-2 rounded-t-sm cursor-pointer hover:opacity-90 transition-opacity`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg">{title}</h2>
        <ChevronIcon isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default ListHeader;
