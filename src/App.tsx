import "./App.css";
import List from "./components/List";
import { availableSnippets } from "./config/snippets";
import type { ListItem } from "./types";
import { UI_CONFIG } from "./constants";
import { useExtensionState } from "./hooks/useExtensionState";
import expandIcon from "./assets/expand.svg";

function App() {
  const { isActive, toggleActive } = useExtensionState();

  const handleCopyClick = (item: ListItem) => {
    if (item.data) {
      if (item.fileType === "txt") {
        navigator.clipboard.writeText(item.data as string);
      } else {
        const jsonString = JSON.stringify(item.data, null, 2);
        navigator.clipboard.writeText(jsonString);
      }
    }
  };

  return (
    <div
      className="bg-gray-100 p-2 overflow-y-auto"
      style={{
        width: `${UI_CONFIG.EXTENSION_WIDTH}px`,
        maxHeight: `${UI_CONFIG.EXTENSION_MAX_HEIGHT}px`,
      }}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 px-3 bg-linear-to-b from-yellow-900 to-yellow-600 rounded-sm">
          <span className="text-2xl font-bold text-zinc-100">
            Power Automate Scopes
          </span>
          <button
            onClick={toggleActive}
            className={`p-2 rounded-sm transition-all cursor-pointer border-2 ${
              isActive
                ? "bg-green-400 border-green-300 hover:bg-green-600"
                : "bg-gray-400 border-gray-300 hover:bg-gray-500"
            }`}
            title={
              isActive
                ? "Active - Output and input window is expanded to defined width. Click to deactivate."
                : "Inactive - Move to normal size"
            }
          >
            <img
              src={expandIcon}
              alt={isActive ? "Active" : "Inactive"}
              className="w-5 h-5"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </button>
        </div>
        {availableSnippets.map((category) => (
          <List
            key={category.title}
            title={category.title}
            gradient={category.gradient}
            items={category.items}
            onCopyClick={handleCopyClick}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
