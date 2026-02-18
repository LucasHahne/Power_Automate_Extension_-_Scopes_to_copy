import React from "react";

interface OptionRowProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
}

/**
 * Single option row: label on the left (normal text), toggle on the right.
 * Toggle is grey when off, green when on.
 */
const OptionRow: React.FC<OptionRowProps> = ({
  label,
  checked,
  onChange,
  id,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div
      className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-sm hover:bg-gray-200/60 transition-colors"
      role="option"
      aria-checked={checked}
    >
      <label
        htmlFor={id}
        className="text-sm font-normal text-gray-800 cursor-pointer flex-1 select-none"
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        title={checked ? "On" : "Off"}
        onClick={() => onChange(!checked)}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 p-0.5 transition-colors
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500
          ${checked ? "justify-end border-green-400 bg-green-400" : "justify-start border-gray-300 bg-gray-300"}
        `}
      >
        <span
          className="pointer-events-none inline-block h-4 w-4 shrink-0 rounded-full bg-white shadow ring-0 transition-transform"
        />
      </button>
    </div>
  );
};

export default OptionRow;
