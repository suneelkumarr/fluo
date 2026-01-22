/**
 * BLITZ - Theme System
 * Create and manage color themes for consistent styling
 */

import { ESC, CLOSE_FG, CLOSE_BG } from '../core/ansi';
import { detectColorLevel } from '../core/detect';
import { hexToRgb, rgbToAnsi256 } from '../core/colors';
import type { Theme } from '../types';

/**
 * Extended theme with all style options
 */
export interface ExtendedTheme extends Theme {
  // Base colors
  primary: string;
  secondary: string;
  accent: string;
  
  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // UI colors
  background: string;
  foreground: string;
  border: string;
  muted: string;
  
  // Text variants
  heading: string;
  link: string;
  code: string;
  
  // Allow custom colors
  [key: string]: string;
}

/**
 * Theme style functions
 */
export interface ThemeStyles {
  primary: (text: string) => string;
  secondary: (text: string) => string;
  accent: (text: string) => string;
  success: (text: string) => string;
  warning: (text: string) => string;
  error: (text: string) => string;
  info: (text: string) => string;
  muted: (text: string) => string;
  heading: (text: string) => string;
  link: (text: string) => string;
  code: (text: string) => string;
  bg: {
    primary: (text: string) => string;
    secondary: (text: string) => string;
    accent: (text: string) => string;
    success: (text: string) => string;
    warning: (text: string) => string;
    error: (text: string) => string;
    info: (text: string) => string;
  };
  [key: string]: ((text: string) => string) | Record<string, (text: string) => string>;
}

/**
 * Built-in themes
 */
export const themes: Record<string, ExtendedTheme> = {
  default: {
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#EC4899',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',
    background: '#1F2937',
    foreground: '#F9FAFB',
    border: '#374151',
    muted: '#6B7280',
    heading: '#F3F4F6',
    link: '#60A5FA',
    code: '#A78BFA',
  },
  
  monokai: {
    primary: '#F92672',
    secondary: '#66D9EF',
    accent: '#A6E22E',
    success: '#A6E22E',
    warning: '#E6DB74',
    error: '#F92672',
    info: '#66D9EF',
    background: '#272822',
    foreground: '#F8F8F2',
    border: '#49483E',
    muted: '#75715E',
    heading: '#F8F8F2',
    link: '#66D9EF',
    code: '#AE81FF',
  },
  
  dracula: {
    primary: '#BD93F9',
    secondary: '#FF79C6',
    accent: '#50FA7B',
    success: '#50FA7B',
    warning: '#F1FA8C',
    error: '#FF5555',
    info: '#8BE9FD',
    background: '#282A36',
    foreground: '#F8F8F2',
    border: '#44475A',
    muted: '#6272A4',
    heading: '#F8F8F2',
    link: '#8BE9FD',
    code: '#FFB86C',
  },
  
  nord: {
    primary: '#88C0D0',
    secondary: '#81A1C1',
    accent: '#B48EAD',
    success: '#A3BE8C',
    warning: '#EBCB8B',
    error: '#BF616A',
    info: '#88C0D0',
    background: '#2E3440',
    foreground: '#ECEFF4',
    border: '#3B4252',
    muted: '#616E88',
    heading: '#ECEFF4',
    link: '#88C0D0',
    code: '#A3BE8C',
  },
  
  github: {
    primary: '#0366D6',
    secondary: '#6F42C1',
    accent: '#D73A49',
    success: '#28A745',
    warning: '#DBAB09',
    error: '#CB2431',
    info: '#0366D6',
    background: '#24292E',
    foreground: '#FAFBFC',
    border: '#30363D',
    muted: '#6A737D',
    heading: '#FAFBFC',
    link: '#58A6FF',
    code: '#79B8FF',
  },
  
  solarized: {
    primary: '#268BD2',
    secondary: '#2AA198',
    accent: '#D33682',
    success: '#859900',
    warning: '#B58900',
    error: '#DC322F',
    info: '#268BD2',
    background: '#002B36',
    foreground: '#839496',
    border: '#073642',
    muted: '#586E75',
    heading: '#93A1A1',
    link: '#268BD2',
    code: '#2AA198',
  },
  
  minimal: {
    primary: '#FFFFFF',
    secondary: '#E5E5E5',
    accent: '#A3A3A3',
    success: '#86EFAC',
    warning: '#FDE047',
    error: '#FCA5A5',
    info: '#93C5FD',
    background: '#171717',
    foreground: '#FAFAFA',
    border: '#262626',
    muted: '#737373',
    heading: '#FAFAFA',
    link: '#E5E5E5',
    code: '#A3A3A3',
  },
  
  ocean: {
    primary: '#00CED1',
    secondary: '#20B2AA',
    accent: '#48D1CC',
    success: '#3CB371',
    warning: '#FFD700',
    error: '#FF6347',
    info: '#87CEEB',
    background: '#0A1628',
    foreground: '#E0FFFF',
    border: '#1A3A52',
    muted: '#5F9EA0',
    heading: '#E0FFFF',
    link: '#00CED1',
    code: '#7FFFD4',
  },
  
  sunset: {
    primary: '#FF6B6B',
    secondary: '#FFE66D',
    accent: '#FF8E72',
    success: '#88D8B0',
    warning: '#FFE66D',
    error: '#FF6B6B',
    info: '#95E1D3',
    background: '#2D1B2E',
    foreground: '#FFF5F5',
    border: '#4A2C4A',
    muted: '#B8A9C9',
    heading: '#FFF5F5',
    link: '#FFB3BA',
    code: '#FF8E72',
  },
  
  forest: {
    primary: '#2D5A27',
    secondary: '#4A7C59',
    accent: '#8FBC8F',
    success: '#228B22',
    warning: '#DAA520',
    error: '#8B0000',
    info: '#6B8E23',
    background: '#1A2F1A',
    foreground: '#E8F5E9',
    border: '#2E4A2E',
    muted: '#6B8E6B',
    heading: '#E8F5E9',
    link: '#90EE90',
    code: '#98FB98',
  },
};

/**
 * Current active theme
 */
let currentTheme: ExtendedTheme = themes.default;

/**
 * Apply foreground color from hex
 */
const applyFg = (hex: string, text: string): string => {
  const level = detectColorLevel();
  if (level === 0) return text;
  
  const [r, g, b] = hexToRgb(hex);
  
  if (level >= 3) {
    return `${ESC}38;2;${r};${g};${b}m${text}${CLOSE_FG}`;
  }
  
  if (level >= 2) {
    const code = rgbToAnsi256(r, g, b);
    return `${ESC}38;5;${code}m${text}${CLOSE_FG}`;
  }
  
  return text;
};

/**
 * Apply background color from hex
 */
const applyBg = (hex: string, text: string): string => {
  const level = detectColorLevel();
  if (level === 0) return text;
  
  const [r, g, b] = hexToRgb(hex);
  
  if (level >= 3) {
    return `${ESC}48;2;${r};${g};${b}m${text}${CLOSE_BG}`;
  }
  
  if (level >= 2) {
    const code = rgbToAnsi256(r, g, b);
    return `${ESC}48;5;${code}m${text}${CLOSE_BG}`;
  }
  
  return text;
};

/**
 * Create style functions from theme
 */
const createThemeStyles = (theme: ExtendedTheme): ThemeStyles => {
  const styles: ThemeStyles = {
    primary: (text: string) => applyFg(theme.primary, text),
    secondary: (text: string) => applyFg(theme.secondary, text),
    accent: (text: string) => applyFg(theme.accent, text),
    success: (text: string) => applyFg(theme.success, text),
    warning: (text: string) => applyFg(theme.warning, text),
    error: (text: string) => applyFg(theme.error, text),
    info: (text: string) => applyFg(theme.info, text),
    muted: (text: string) => applyFg(theme.muted, text),
    heading: (text: string) => `${ESC}1m${applyFg(theme.heading, text)}${ESC}22m`,
    link: (text: string) => `${ESC}4m${applyFg(theme.link, text)}${ESC}24m`,
    code: (text: string) => applyFg(theme.code, text),
    bg: {
      primary: (text: string) => applyBg(theme.primary, text),
      secondary: (text: string) => applyBg(theme.secondary, text),
      accent: (text: string) => applyBg(theme.accent, text),
      success: (text: string) => applyBg(theme.success, text),
      warning: (text: string) => applyBg(theme.warning, text),
      error: (text: string) => applyBg(theme.error, text),
      info: (text: string) => applyBg(theme.info, text),
    },
  };
  
  // Add custom color functions
  for (const [key, value] of Object.entries(theme)) {
    if (!(key in styles) && typeof value === 'string' && value.startsWith('#')) {
      styles[key] = (text: string) => applyFg(value, text);
    }
  }
  
  return styles;
};

/**
 * Active theme styles
 */
let activeStyles: ThemeStyles = createThemeStyles(currentTheme);

/**
 * Get current theme
 */
export const getTheme = (): ExtendedTheme => ({ ...currentTheme });

/**
 * Set active theme by name or custom theme
 */
export const setTheme = (themeNameOrTheme: string | ExtendedTheme): void => {
  if (typeof themeNameOrTheme === 'string') {
    const theme = themes[themeNameOrTheme];
    if (!theme) {
      throw new Error(`Theme "${themeNameOrTheme}" not found. Available: ${Object.keys(themes).join(', ')}`);
    }
    currentTheme = theme;
  } else {
    currentTheme = themeNameOrTheme;
  }
  
  activeStyles = createThemeStyles(currentTheme);
};

/**
 * Register a custom theme
 */
export const registerTheme = (name: string, theme: ExtendedTheme): void => {
  themes[name] = theme;
};

/**
 * Get available theme names
 */
export const getThemeNames = (): string[] => Object.keys(themes);

/**
 * Get theme styles
 */
export const getStyles = (): ThemeStyles => activeStyles;

/**
 * Create a scoped theme (doesn't affect global)
 */
export const createTheme = (theme: Partial<ExtendedTheme>): ThemeStyles => {
  const merged = { ...themes.default, ...theme } as ExtendedTheme;
  return createThemeStyles(merged);
};

/**
 * Theme-aware styling (uses current theme)
 */
export const theme = {
  get primary() { return activeStyles.primary; },
  get secondary() { return activeStyles.secondary; },
  get accent() { return activeStyles.accent; },
  get success() { return activeStyles.success; },
  get warning() { return activeStyles.warning; },
  get error() { return activeStyles.error; },
  get info() { return activeStyles.info; },
  get muted() { return activeStyles.muted; },
  get heading() { return activeStyles.heading; },
  get link() { return activeStyles.link; },
  get code() { return activeStyles.code; },
  get bg() { return activeStyles.bg; },
};

/**
 * Extend current theme with overrides
 */
export const extendTheme = (overrides: Partial<ExtendedTheme>): void => {
  currentTheme = { ...currentTheme, ...overrides } as ExtendedTheme;
  activeStyles = createThemeStyles(currentTheme);
};

/**
 * Reset to default theme
 */
export const resetTheme = (): void => {
  currentTheme = themes.default;
  activeStyles = createThemeStyles(currentTheme);
};

/**
 * Create semantic logger with theme colors
 */
export const createLogger = (customTheme?: Partial<ExtendedTheme>) => {
  const styles = customTheme ? createTheme(customTheme) : activeStyles;
  
  return {
    log: (...args: unknown[]) => console.log(...args),
    info: (...args: unknown[]) => console.log(styles.info('[INFO]'), ...args),
    success: (...args: unknown[]) => console.log(styles.success('[SUCCESS]'), ...args),
    warn: (...args: unknown[]) => console.log(styles.warning('[WARN]'), ...args),
    error: (...args: unknown[]) => console.log(styles.error('[ERROR]'), ...args),
    debug: (...args: unknown[]) => console.log(styles.muted('[DEBUG]'), ...args),
  };
};

/**
 * Color palette from theme
 */
export const palette = (themeName?: string): Record<string, string> => {
  const t = themeName ? themes[themeName] || themes.default : currentTheme;
  return { ...t };
};

/**
 * Get contrasting text color for a theme color
 */
export const getContrastText = (colorKey: keyof ExtendedTheme): 'black' | 'white' => {
  const hex = currentTheme[colorKey];
  if (!hex || !hex.startsWith('#')) return 'white';
  
  const [r, g, b] = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
};