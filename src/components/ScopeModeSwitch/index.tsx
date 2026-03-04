import type { ScopeMode } from "../../hooks/useScopeMode";

const OPTIONS: { value: ScopeMode; label: string }[] = [
  { value: "prebuilt", label: "Prebuilt" },
  { value: "custom", label: "Custom" },
];

interface ScopeModeSwitchProps {
  mode: ScopeMode;
  onModeChange: (mode: ScopeMode) => void;
}

export default function ScopeModeSwitch({ mode, onModeChange }: ScopeModeSwitchProps) {

  return (
    <div className="w-full bg-white rounded-sm shadow-md overflow-hidden">
      <div className="divide-y divide-gray-100">
        <div className="py-1.5 px-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-2">
            Scope source
          </span>
          <div className="flex gap-2" role="radiogroup" aria-label="Scope source">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={mode === opt.value}
                title={opt.label}
                onClick={() => onModeChange(opt.value)}
                className={`
                  flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500
                  ${
                    mode === opt.value
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
