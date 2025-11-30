import "./App.css";
import List from "./components/ListComponent/List";
import { scriptCategories } from "./data/sampleScripts";

function App() {
  const handleItemClick = (item: any) => {
    console.log("Clicked:", item.name);
  };

  const handleCopyClick = (item: any) => {
    if (item.jsonData) {
      const jsonString = JSON.stringify(item.jsonData, null, 2);
      navigator.clipboard
        .writeText(jsonString)
        .then(() => {
          console.log("Copied to clipboard:", item.name);
          // You can add a toast notification here
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
        });
    } else {
      console.log("No JSON data available for:", item.name);
    }
  };

  return (
    <div className="bg-gray-100 p-2 w-[400px] max-h-[500px] overflow-y-auto">
      <div className="space-y-2">
        <div className="flex justify-center py-2 bg-linear-to-b from-yellow-900 to-yellow-600 rounded-sm">
          <span className="text-3xl font-bold text-zinc-200">
            Power Automate Scopes
          </span>
        </div>
        {scriptCategories.map((category, index) => (
          <List
            key={index}
            title={category.title}
            gradient={category.gradient}
            items={category.items}
            onItemClick={handleItemClick}
            onCopyClick={handleCopyClick}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
