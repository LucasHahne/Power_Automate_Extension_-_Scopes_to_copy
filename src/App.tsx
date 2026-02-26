import "./App.css";
import List from "./components/List";
import OptionsSection from "./components/Options";
import ExpandPanelSettingsRow from "./components/Options/ExpandPanelSettingsRow";
import ExpandExpressionWindowSettingsRow from "./components/Options/ExpandExpressionWindowSettingsRow";
import { availableSnippets } from "./config/snippetLoader";
import { githubIssueUrls, getReportBugUrl } from "./config/githubIssues";
import { browserAPI, isExtensionContext } from "./utils/browserAPI";
import type { ListItem } from "./types";
import { useOptions } from "./hooks/useOptions";

function getExtensionVersion(): string {
  if (!isExtensionContext()) return "unknown";
  try {
    const manifest = browserAPI.runtime.getManifest() as { version?: string };
    return manifest?.version ?? "unknown";
  } catch {
    return "unknown";
  }
}

const reportBugUrl = getReportBugUrl(getExtensionVersion());

function App() {
  const options = useOptions();

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
      className="flex min-h-full w-full flex-col bg-gray-100 p-2 box-border"
      style={{ minHeight: "100vh" }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-2">
          <div className="py-2 px-3 bg-linear-to-b from-yellow-900 to-yellow-600 rounded-sm">
            <span className="text-2xl font-bold text-zinc-100">
              Power Automate Scopes
            </span>
          </div>
          <OptionsSection options={options}>
            <ExpandPanelSettingsRow />
            <ExpandExpressionWindowSettingsRow />
          </OptionsSection>
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
      <footer className="mt-auto shrink-0 pt-3 border-t border-gray-300 text-sm text-gray-600 flex items-center justify-between gap-2">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          <a
            href={reportBugUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Report an issue
          </a>
          <a
            href={githubIssueUrls.suggestFeature}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            Suggest a feature
          </a>
        </div>
        <span className="shrink-0 text-gray-500">v{getExtensionVersion()}</span>
      </footer>
    </div>
  );
}

export default App;
