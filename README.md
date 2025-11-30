# Power Automate Browser Extension

A browser extension that provides quick access to Power Automate script templates and snippets. Copy-paste ready JSON configurations for common Power Automate patterns including variables, error handling, and more.

## Features

- 📋 **Quick Copy-Paste**: One-click copying of Power Automate JSON configurations
- 🎨 **Organized Categories**: Scripts grouped by type (Variables, Error Handling, Dataverse, Sharepoint)
- 🔄 **Collapsible Lists**: Clean, organized interface with expandable/collapsible sections
- 🎯 **Browser Extension**: Easy access directly from your browser toolbar
- ⚡ **Fast & Lightweight**: Built with React + Vite for optimal performance

## Available Script Templates

### Variables

- Boolean variable (Initialize)
- Integer variable (Initialize)
- Float variable (Initialize)
- String variable (Initialize)
- Object variable (Initialize)
- Array variable (Initialize)

### Error Handling

- Basic Error Handler
- Basic Error Handler with Email Notification
- Basic Error Handler with Jira Ticket Creation

### Coming Soon

- Dataverse operations
- SharePoint integrations
- Custom automation workflows

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Vite** - Build tool
- **CRXJS** - Browser extension plugin

## Installation

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/LucasHahne/PowerAutomateBrowserExtension.git
   cd PowerAutomate
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Load Extension in Browser

#### Chrome/Edge

1. Open `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder from the built project

#### Firefox

1. Open `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to the `dist` folder and select `manifest.json`

## Project Structure

```
PowerAutomate/
├── public/
│   └── manifest.json          # Extension manifest
├── src/
│   ├── components/
│   │   ├── IconComponent/     # Icon components
│   │   │   └── ListIcons.tsx
│   │   └── ListComponent/     # List UI components
│   │       ├── List.tsx
│   │       ├── ListHeader.tsx
│   │       └── ListContent.tsx
│   ├── data/
│   │   ├── variables/         # Variable JSON templates
│   │   ├── error handling/    # Error handling JSON templates
│   │   └── sampleScripts.tsx  # Script categories configuration
│   ├── assets/                # Images and icons
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Usage

1. **Click the extension icon** in your browser toolbar
2. **Browse categories** - Click on a category header to expand/collapse
3. **Copy a template** - Click the copy icon (📋) next to any script
4. **Paste in Power Automate** - The JSON is now in your clipboard, ready to paste

## Adding New Templates

1. **Create JSON file** in the appropriate folder (`src/data/variables/`, `src/data/error handling/`, etc.)
2. **Import in `sampleScripts.tsx`**:
   ```typescript
   import myNewTemplate from "./category/my-template.json";
   ```
3. **Add to category items**:
   ```typescript
   {
     id: "unique-id",
     name: "Template Name",
     icon: <YourIcon />,
     category: "categoryName",
     jsonData: myNewTemplate,
   }
   ```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Firefox 89+
- ✅ Opera 74+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Lucas Hahne**

## Acknowledgments

- Power Automate community for inspiration
- React and Vite teams for excellent tooling
- Tailwind CSS for the styling framework
