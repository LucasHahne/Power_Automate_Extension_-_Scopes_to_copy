import React from "react";
import OptionRow from "./OptionRow";

export interface OptionItem {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface OptionsSectionProps {
  options?: OptionItem[];
  /** Optional section title; omit to show only the rows */
  title?: string;
  /** Optional custom rows (e.g. composite controls) */
  children?: React.ReactNode;
}

/**
 * Renders a compact options block: one row per option with label left, toggle right.
 * Extensible: pass options from a single source (e.g. useOptions hook).
 */
const OptionsSection: React.FC<OptionsSectionProps> = ({
  options,
  title,
  children,
}) => {
  const hasOptions = (options?.length ?? 0) > 0;
  const hasChildren = children != null;
  if (!hasOptions && !hasChildren) return null;

  return (
    <div className="w-full bg-white rounded-sm shadow-md overflow-hidden">
      {title ? (
        <div className="px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-200">
          {title}
        </div>
      ) : null}
      <div className="divide-y divide-gray-100">
        {children}
        {options?.map((opt) => (
          <OptionRow
            key={opt.id}
            id={`option-${opt.id}`}
            label={opt.label}
            checked={opt.checked}
            onChange={opt.onChange}
          />
        ))}
      </div>
    </div>
  );
};

export default OptionsSection;
export { OptionRow };
