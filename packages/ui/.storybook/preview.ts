/// <reference types="vite/client" />
import type { Decorator, Preview } from "@storybook/react-vite";
import "@rwts/ui/theme/globals.css";

// Vite の define で a11y:dark プロジェクトのみ true に置換される
// eslint-disable-next-line no-underscore-dangle
declare const __VITEST_DARK__: boolean | undefined;

const withTheme: Decorator = (Story, context) => {
  // eslint-disable-next-line no-underscore-dangle
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
        color: /(?<colorMatch>background|color)$/iu,
        date: /Date$/iu,
      },
    },
    a11y: {
      test: "error",
    },
  },
};

export default preview;
