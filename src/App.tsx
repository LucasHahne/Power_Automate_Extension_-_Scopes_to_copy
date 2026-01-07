import "./App.css";
import List from "./components/List";
import { availableSnippets } from "./config/snippets";
import type { ListItem } from "./types";
import { UI_CONFIG } from "./constants";

function App() {
  const handleCopyClick = (item: ListItem) => {
    if (item.jsonData) {
      const jsonString = JSON.stringify(item.jsonData, null, 2);
      navigator.clipboard.writeText(jsonString);
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
        <div className="flex justify-center py-2 bg-linear-to-b from-yellow-900 to-yellow-600 rounded-sm">
          <span className="text-3xl font-bold text-zinc-100">
            Power Automate Scopes
          </span>
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
