const GITHUB_ISSUES_BASE =
  "https://github.com/LucasHahne/PowerAutomateBrowserExtension/issues";
const GITHUB_NEW_ISSUE = `${GITHUB_ISSUES_BASE}/new`;

function buildBugBody(extensionVersion: string): string {
  return [
    "## Extension version",
    extensionVersion,
    "",
    "## What happened?",
    "<!-- Describe the bug -->",
    "",
    "## Steps to reproduce",
    "1. ",
    "2. ",
    "3. ",
    "",
    "## Expected behavior",
    "<!-- What did you expect? -->",
    "",
    "## Actual behavior",
    "<!-- What actually happened? -->",
  ].join("\n");
}

const ISSUE_BODY_FEATURE = [
  "## Short Description",
  "<!-- What does this action do? Keep it simple – think of how you'd explain it to a colleague -->",
  "",
  "## Trigger / Use Case",
  "<!-- When would someone use this? What problem does it solve? -->",
  "",
  "## Category",
  "<!-- e.g. Variables, Error Handling, Dataverse, SharePoint, Notifications (or suggest a new one) -->",
  "",
  "## The JSON",
  "<!-- Paste your Power Automate action JSON below. Remove credentials and static values (connection refs, SharePoint IDs, GUIDs, etc.) -->",
  "```json",
  "",
  "```",
  "",
  "_Please remove any credentials and static values that others cannot use (connection references, SharePoint libraries/lists with IDs, GUIDs, etc.)._",
].join("\n");

function buildNewIssueUrl(title: string, body: string): string {
  const params = new URLSearchParams({
    title,
    body,
  });
  return `${GITHUB_NEW_ISSUE}?${params.toString()}`;
}

export function getReportBugUrl(extensionVersion: string): string {
  return buildNewIssueUrl("Bug: ", buildBugBody(extensionVersion));
}

export const githubIssueUrls = {
  suggestFeature: buildNewIssueUrl("New Flow Action: ", ISSUE_BODY_FEATURE),
} as const;
