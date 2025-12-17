# React Premium Component Boilerplate

A production-ready, highly scalable React component library boilerplate built with **Tailwind CSS v4**, **TypeScript**, and **Class Variance Authority (CVA)**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8)

## 🚀 Features

- **Headless Architecture**: Logic and styling separated using `cva` and `radix-ui` patterns.
- **Pure CSS Theming**: Zero-runtime CSS-in-JS. All themes utilize native CSS variables (`var(--color-primary-500)`).
- **Tailwind CSS v4**: Bleeding edge utility-first styling with `@theme` blocks.
- **Dark Mode Support**: Built-in support for light/dark modes via data attributes.
- **Fully Typed**: Written in TypeScript with strict mode enabled.
- **No Bloat**: Zero unnecessary dependencies. Just React, Lucide-React (Icons), and utilities.

## 🛠️ Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/2023207042/react-boiler-plate.git
    cd react-boiler-plate
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```

3.  **Start the development server**
    ```bash
    npm run dev
    ```

## 🎨 Theming System

This project uses a robust, variable-based theming system located in `src/styles/`.

### Structure

```
src/styles/
├── base.css          # Reset and global standard styles
├── index.css         # Main entry point, imports themes
└── themes/
    ├── default.css   # Light theme (CSS variables)
    └── dark.css      # Dark theme overrides
```

### Customizing Colors

To change the primary brand color, open `src/styles/themes/default.css` and modify the HSLA/Hex mapped variables:

```css
:root {
  /* Change Brand Color */
  --color-primary-500: #3b82f6; /* Blue-500 */
  --color-primary-600: #2563eb; /* Blue-600 */
}
```

## 📦 Components

The library includes a comprehensive suite of components refactored for consistency:

### Form Elements

- **`RNButton`**: Variants (solid, outline, ghost), Loading state, Icons.
- **`RNInput`**: Floating labels, error states, password toggle.
- **`RNSelect`**: Native select with premium styling.
- **`RNSwitch`**: iOS-style toggle switch.
- **`RNTextarea`**: Auto-styled text area.
- **`RNBatchInput`**: Tags/Chips input with sorting.

### Data Display

- **`RNTable`**: **Advanced**. Supports client/server pagination, sorting, and generic columns.
- **`RNCard`**: Elevated, outlined, or flat cards.
- **`RNBadge`**: Status indicators (Success, Warning, Error).
- **`RNTag`**: Categorization tags.
- **`RNAvatar`**: User profile images with fallbacks.
- **`RNAccordion`**: Collapsible content sections.
- **`RNTabs`**: Tabbed interface navigation.

### Feedback & Overlays

- **`RNModal`**: Accessible dialogs with backdrop blur.
- **`RNAlert`**: Contextual alerts (Success, Info, Warning, Error).
- **`RNToast`**: Non-blocking notifications.
- **`RNTooltip`**: Hover-triggered helper text.

### Layout & Utils

- **`RNNavbar`**: Responsive navigation bar.
- **`RNContainer`**: Responsive constraints.
- **`RNBreadCrumb`**: Page hierarchy navigation.

## 💻 Usage Example

```tsx
import { RNButton } from "@/components/RNButton";
import { RNInput } from "@/components/RNInput";
import { RNCard } from "@/components/RNCard";

function LoginForm() {
  return (
    <RNCard className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="space-y-4">
        <RNInput label="Email" placeholder="you@example.com" />
        <RNInput label="Password" type="password" />
        <RNButton fullWidth>Sign In</RNButton>
      </div>
    </RNCard>
  );
}
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
