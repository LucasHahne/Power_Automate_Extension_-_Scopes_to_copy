import { useState, useRef, useEffect } from "react";
import { useCustomScopes } from "../../hooks/useCustomScopes";
import type { CustomScope } from "../../types";
import { UI_CONFIG } from "../../constants";

const RAINBOW_GRADIENT =
  "linear-gradient(to right, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #6366f1, #8b5cf6)";

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

const CheckIcon = () => (
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
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

const DeleteIcon = () => (
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
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const inputBaseClass =
  "w-full rounded-sm border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800 " +
  "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2";

export default function CustomScopesSection() {
  const { customScopes, addScope, removeScope } = useCustomScopes();
  const [popupOpen, setPopupOpen] = useState(false);
  const [scopeToDelete, setScopeToDelete] = useState<CustomScope | null>(null);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const openPopup = () => {
    setPopupOpen(true);
    setError(null);
    setName("");
    setContent("");
  };

  const closePopup = () => {
    setPopupOpen(false);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedContent = content.trim();
    if (!trimmedName) {
      setError("Please enter a scope name.");
      return;
    }
    if (!trimmedContent) {
      setError("Please enter scope content (JSON).");
      return;
    }
    try {
      JSON.parse(trimmedContent);
    } catch {
      setError("Scope content must be valid JSON.");
      return;
    }
    const success = addScope(trimmedName, trimmedContent);
    if (!success) {
      setError("Scope content must be valid JSON.");
      return;
    }
    setName("");
    setContent("");
    closePopup();
  };

  const handleCopy = (scope: CustomScope) => {
    try {
      const toCopy = JSON.stringify(JSON.parse(scope.data), null, 2);
      navigator.clipboard.writeText(toCopy);
    } catch {
      navigator.clipboard.writeText(scope.data);
    }
    setCopiedId(scope.id);
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = window.setTimeout(() => {
      setCopiedId(null);
    }, UI_CONFIG.COPY_FEEDBACK_DURATION);
  };

  return (
    <div className="space-y-2">
      <div className="w-full overflow-auto shadow-md bg-white rounded-sm">
        <div
          className="px-4 py-2 rounded-t-sm cursor-default flex items-center justify-between gap-2"
          style={{ background: RAINBOW_GRADIENT }}
        >
          <h2 className="text-white font-semibold text-lg">Custom</h2>
          <button
            type="button"
            onClick={openPopup}
            className="shrink-0 py-1.5 px-3 rounded-md text-sm font-medium bg-white/20 text-white hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white transition-colors"
          >
            Add Scope
          </button>
        </div>
        <div className="w-full">
          {customScopes.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No custom scopes yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {customScopes.map((scope) => {
                const isCopied = copiedId === scope.id;
                return (
                  <li
                    key={scope.id}
                    className="flex items-center gap-3 px-4 py-1 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900 flex-1">
                      {scope.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(scope)}
                      className={`shrink-0 p-2 rounded-md transition-colors ${
                        isCopied
                          ? "text-green-600 bg-green-50"
                          : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                      aria-label={isCopied ? "Copied" : "Copy to clipboard"}
                    >
                      {isCopied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setScopeToDelete(scope)}
                      className="shrink-0 p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="Delete scope"
                    >
                      <DeleteIcon />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {popupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) => e.target === e.currentTarget && closePopup()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-scope-title"
        >
          <div
            className="w-full max-w-md bg-white rounded-lg shadow-xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="add-scope-title"
              className="text-lg font-semibold text-gray-900"
            >
              Add Power Automate scope
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Scope name <span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My custom scope"
                  className={`${inputBaseClass} mt-1`}
                  aria-label="Scope name"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Scope content (JSON) <span className="text-red-500">*</span>
                </span>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste Power Automate scope JSON here..."
                  rows={6}
                  className={`${inputBaseClass} mt-1 resize-y`}
                  aria-label="Scope content as JSON"
                />
              </label>
              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={closePopup}
                  className="py-2 px-3 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="py-2 px-3 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-300 enabled:bg-green-500 enabled:text-white enabled:hover:bg-green-600"
                >
                  Add scope
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {scopeToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={(e) =>
            e.target === e.currentTarget && setScopeToDelete(null)
          }
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-scope-title"
        >
          <div
            className="w-full max-w-md bg-white rounded-lg shadow-xl p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="delete-scope-title"
              className="text-lg font-semibold text-gray-900"
            >
              Delete scope
            </h3>
            <p className="text-sm text-gray-700">
              Do you really want to delete the scope &quot;{scopeToDelete.name}
              &quot;?
            </p>
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setScopeToDelete(null)}
                className="py-2 px-3 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  removeScope(scopeToDelete.id);
                  setScopeToDelete(null);
                }}
                className="py-2 px-3 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
