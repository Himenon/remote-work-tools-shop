import type { Decorator, Preview } from "@storybook/nextjs-vite";
import "../src/app/globals.css";

// Vite の define で a11y:dark プロジェクトのみ true に置換される
declare const __VITEST_DARK__: boolean | undefined;

const withTheme: Decorator = (Story, context) => {
  const isDarkForced = __VITEST_DARK__ !== undefined && __VITEST_DARK__;
  const isDark = isDarkForced || (context.globals as { theme?: string }).theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.backgroundColor = isDark ? "oklch(15% 1% 264deg)" : "";
  return Story();
};

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "カラースキーム",
    defaultValue: "light",
    toolbar: {
      icon: "circlehollow",
      items: [
        { value: "light", icon: "sun", title: "Light" },
        { value: "dark", icon: "moon", title: "Dark" },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "error",
    },
  },
};

export default preview;
