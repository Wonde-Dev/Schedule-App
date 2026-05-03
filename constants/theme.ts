/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#2563EB';
const tintColorDark = '#60A5FA';

export const Colors = {
  light: {
    text: '#1F2937',
    background: '#F3F4F6',
    tint: tintColorLight,
    icon: '#4B5563',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    muted: '#9CA3AF',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#EC4899',
  },
  dark: {
    text: '#F9FAFB',
    background: '#0F172A',
    tint: tintColorDark,
    icon: '#D1D5DB',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorDark,
    card: '#1E293B',
    border: '#334155',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    muted: '#6B7280',
    primary: '#818CF8',
    secondary: '#A78BFA',
    accent: '#F472B6',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
