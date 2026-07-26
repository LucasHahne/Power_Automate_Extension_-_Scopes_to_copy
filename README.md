# Power Automate Browser Extension - Scopes to Copy

**Version:** 2.1.0.0

Hey there! Welcome to the Power Automate Browser Extension - Scopes to Copy – your friendly companion for building Power Automate flows faster and easier. This extension gives you instant access to ready-to-use action templates right from your browser toolbar. Just click, copy, and paste into your flows!

[![Available in the Chrome Web Store](https://developer.chrome.com/static/docs/webstore/branding/image/mPGKYBIR2uCP0ApchDXE.png)](https://chromewebstore.google.com/detail/power-automate-extension/hfbdkblkbenbeeoccmbpmpgkakmckdmc)

Get the extension for Chrome to use one-click copy, organized categories, custom scope storage, and configurable panel/expression window expansion on make.powerautomate.com.

(Only the new designer is supported for now)

## What's This All About?

This extension is a growing collection of Power Automate actions and flow templates that you can grab and use in seconds. No more rebuilding the same patterns over and over – got you covered with pre-configured JSON templates for common scenarios like variables, error handling, and much more.

## What's Inside?

### Variables

- Boolean variable (Initialize)
- Integer variable (Initialize)
- Float variable (Initialize)
- String variable (Initialize)
- Object variable (Initialize)
- Array variable (Initialize)

### Error Handling

- Basic Error Handler
- Basic Error Handler incl. Terminate
- Basic Error Handler with mail
- Basic Error Handler with mail incl. Terminate

Error handling scopes require a **Scope - Try** that wraps the actions you want to monitor; the catch block uses it to get the proper error information.

### SharePoint

- Request Manager Approval
- Search for file by name
- Search for file by name (Filter Query only)
- Search for folder by name
- Search for folder by name (Filter Query only)
- Search for file by Filetype
- Search for file by Filetype (Filter Query only)
- Batch create items in SP List
- Batch update items in SP List
- Batch delete items in SP List

### Excel Online (Business)

- Filter Tablerows which are not empty

### Dataverse

- Send picture embedded via mail

### Outlook

- Save attachment to SharePoint

### More Coming Soon!

The library is constantly growing with new actions and templates!

## How to Use

1. **Click the extension icon** in your browser toolbar
2. **Choose your scope source** – Below the settings, use the switch to select **Prebuilt** (built-in categories) or **Custom** (your own saved scopes). Your choice is saved and restored when you open the side panel again (no flash to the wrong mode while settings load).
3. **Browse the categories** – Click any category header to expand or collapse. Which categories are open stays saved for your next visit.
4. **Copy what you need** – Click the copy icon (📋) next to any action
5. **Paste into Power Automate** – The JSON is on your clipboard, ready to go!

### Custom scopes

When you select **Custom** as the scope source, you can store and manage your own Power Automate scope JSON:

- **Add a scope** – Click **Show new** in the Custom section header. A popup opens where you enter a **scope name** and **paste the scope JSON** (from Power Automate). Click **Add scope** to save it. The scope name is required; the content must be valid JSON so it can be copied back into Power Automate.
- **Copy** – Use the copy icon next to a custom scope to copy its JSON to the clipboard (pretty-printed) for pasting into Power Automate.
- **Delete** – Click the trash icon to remove a scope. A confirmation popup asks whether you really want to delete it; choose **Cancel** to keep it or **Delete** to remove it from the extension and storage.

All custom scopes are listed under the **Custom** header (rainbow-styled) and are stored in the extension so they persist across sessions.

### Settings

**Expand expression window**: When enabled, the raw Inputs/Outputs (expression) window is widened to a configurable percentage of the screen so you can debug and see values more easily. You can set the width and toggle it on or off in the extension options.

**Expand output and input panel**: When enabled, the output and input panel is widened to a configurable percentage. Width and on/off can be set in the extension options.

**Copy expression on JSON click**: When enabled, clicking a key or value in an action's run-history Outputs JSON copies the matching Power Automate expression to your clipboard (with a short confirmation). For example, clicking `"name"` inside the `value` array of an action called `Get_worksheets_-_Production_Data_Large` copies:

```text
outputs('Get_worksheets_-_Production_Data_Large')?['body']?['value']?[0]?['name']
```

Paste it straight into the expression editor (no leading `@` needed). For **Initialize variable** / **Set variable** (and related) actions, the expression uses `variables('varName')` instead of the long `outputs(...)` path when the variable name is visible in the JSON. Because the run viewer only loads the visible part of large responses, the extension reconstructs the path from what is on screen and closes any unbalanced brackets, so keep the key/value you click (and its parent keys) visible for the most accurate result. Toggle it on or off in the extension options.

## Want to Add a New Flow Action?

This is a community-driven project, and we'd love your contributions! If you have a Power Automate action or flow pattern that you think others would find useful, here's how to share it:

### Step 1: Open a GitHub Issue

Head over to the [GitHub Issues page](https://github.com/LucasHahne/PowerAutomateBrowserExtension/issues) and create a new issue titled like: **"New Flow Action: [Your Action Name]"**

### Step 2: Provide the Details

In your issue, please include:

1. **Short Description**: What does this action do? Keep it simple – think of how you'd explain it to a colleague
2. **Trigger/Use Case**: When would someone use this? What problem does it solve?
3. **Category**: Which category does it belong to? If your's is currently not existing, we are going to set one up! (Variables, Error Handling, Dataverse, SharePoint, Notifications, etc.)
4. **The JSON**: Attach or paste your Power Automate action JSON

Please make sure to delete any credentials and if possible static values which other cannot use.
Meaning Connection References, Sharepoint Libraries or Lists with their IDs, GUIDs etc.

### Step 3: We'll Review & Add It

Once you submit the issue, I'll review it to make sure everything works correctly and fits well with the existing templates. If it looks good, I'll add it to the extension and credit you in the release notes!

### What Makes a Good Submission?

- **Reusable**: The action should be generic enough that others can adapt it to their needs
- **Well-configured**: Include sensible defaults and clear parameter names
- **Tested**: Make sure it actually works in Power Automate
- **Documented**: Your description should help people understand when and how to use it

Don't worry if you're not sure about something – just open that issue and we'll figure it out together!

## Questions or Issues?

If you run into any problems or have questions:

- Open an issue on [GitHub](https://github.com/LucasHahne/PowerAutomateBrowserExtension/issues)
- Check existing issues to see if someone else has had the same question

## Version history

### 2.1.0.0

- **New feature:** Click a key or value in an action's run-history Outputs JSON to copy the matching Power Automate expression (e.g. `outputs('Action')?['body']?['value']?[0]?['name']`) straight to your clipboard, with a short confirmation toast. Toggle it on or off under **Copy expression on JSON click** in the extension options.

### 2.0.3.2

- **Dependencies:** Refreshed the lockfile and dependency tree to current package versions.

### 2.0.3.1

- **Dependencies:** Updated project packages (React 19, Vite 8, TypeScript tooling, and related dev dependencies) to their latest versions.
- **Cleanup:** Removed the leftover placeholder options config, its `useOptions` hook, and the unused `OptionDefinition` type that were causing a broken build after a previous refactor.

### 2.0.3.0

- **SharePoint:** New snippets for filtering files by file type (full scope + OData filter-query text), plus batch **create**, **update**, and **delete** items for SharePoint lists.
- **Templates:** Prebuilt JSON snippets use neutral connection metadata (`connection: null` without an embedded connection name), so pasted scopes are easier to wire to your own connections in Power Automate.

### 2.0.2.0

- **TypeScript / React:** Stricter typings (events, hooks, `ListItem` variants), function components instead of `React.FC`, and clearer icon registry types.
- **Linting:** `eslint-plugin-react` added alongside existing React Hooks rules; redundant hydration `setState` paths in storage hooks removed for cleaner effects.
- **UI polish:** Extension version string is computed once for the bug-report link and footer.

### 2.0.1.0

- **Prebuilt categories:** Each category’s expanded or collapsed state is stored in the extension, so your layout returns after you close the side panel or come back later.
- **Scope source:** **Prebuilt** vs **Custom** is read from storage before the main content is shown, so the panel does not briefly open on the wrong source while loading.

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Lucas Hahne**

Thanks for checking out the Power Automate Browser Extension! Whether you're using it or contributing to it, you're helping make Power Automate development easier for everyone. Happy automating!
