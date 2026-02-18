import React, { useMemo, useState } from "react";
import { useExpandPanelSettings } from "../../hooks/useExpandPanelSettings";

const inputBaseClass =
  "w-16 rounded-sm border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 " +
  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2";

const switchBaseClass =
  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 p-0.5 transition-colors " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500";

export default function ExpandPanelSettingsRow() {
  const { isActive, toggleActive, widthPercent, setWidthPercent } =
    useExpandPanelSettings();

  const [draft, setDraft] = useState<string>(String(widthPercent));

  // Keep draft in sync if storage changes after mount.
  React.useEffect(() => {
    setDraft(String(widthPercent));
  }, [widthPercent]);

  const parsed = useMemo(() => {
    const n = Number(draft);
    return Number.isFinite(n) ? n : NaN;
  }, [draft]);

  const commit = async () => {
    if (!Number.isFinite(parsed)) {
      setDraft(String(widthPercent));
      return;
    }
    await setWidthPercent(parsed);
  };

  return (
    <div className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-sm hover:bg-gray-200/60 transition-colors">
      <span className="text-sm font-normal text-gray-800 select-none">
        Expand output and input panel
      </span>

      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={100}
            step={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void commit();
              }
              if (e.key === "Escape") {
                setDraft(String(widthPercent));
              }
            }}
            aria-label="Expanded panel width percent"
            className={inputBaseClass}
          />
          <span className="ml-1 text-sm text-gray-600 select-none">%</span>
        </div>

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
    </div>
  );
}

