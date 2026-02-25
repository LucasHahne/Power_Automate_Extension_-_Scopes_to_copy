import { useExpandExpressionWindowSettings } from "../../hooks/useExpandExpressionWindowSettings";

const switchBaseClass =
  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 p-0.5 transition-colors " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500";

export default function ExpandExpressionWindowSettingsRow() {
  const { isActive, toggleActive } = useExpandExpressionWindowSettings();

  return (
    <div className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-sm hover:bg-gray-200/60 transition-colors">
      <span className="text-sm font-normal text-gray-800 select-none">
        Expand expression window as default
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        title={isActive ? "On" : "Off"}
        onClick={toggleActive}
        className={`${switchBaseClass} ${
          isActive
            ? "justify-end border-green-400 bg-green-400"
            : "justify-start border-gray-300 bg-gray-300"
        }`}
      >
        <span className="pointer-events-none inline-block h-4 w-4 shrink-0 rounded-full bg-white shadow ring-0 transition-transform" />
      </button>
    </div>
  );
}
