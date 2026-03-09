# Power Automate Browser Extension - Scopes to Copy

**Version:** 2.0.0.1

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
2. **Choose your scope source** – Below the settings, use the switch to select **Prebuilt** (built-in categories) or **Custom** (your own saved scopes). Your choice is saved so the right view opens next time.
3. **Browse the categories** – Click any category header to expand and see what's available
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

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Lucas Hahne**

Thanks for checking out the Power Automate Browser Extension! Whether you're using it or contributing to it, you're helping make Power Automate development easier for everyone. Happy automating!
