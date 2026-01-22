/**
 * BLITZ - Core Styles Engine
 * High-performance style management and composition
 */

import { OPEN, CLOSE, ESC, CLOSE_FG, CLOSE_BG } from './ansi';
import { detectColorLevel } from './detect';
import { rgbToAnsi256, hexToRgb, hslToRgb } from './colors';
import type { StyleName } from '../types';

/**
 * Basic style function (open/close codes)
 */
export interface StyleDef {
  open: string;
  close: string;
}

/**
 * Compiled style (pre-computed open/close sequences)
 */
export interface CompiledStyle {
  open: string;
  close: string;
  openStack: string[];
  closeStack: string[];
}

/**
 * Style cache for performance
 */
const styleCache = new Map<string, CompiledStyle>();
const MAX_CACHE_SIZE = 500;

/**
 * Create a style definition from name
 */
export const getStyleDef = (name: StyleName): StyleDef => {
  return {
    open: OPEN[name] || '',
    close: CLOSE[name] || '',
  };
};

/**
 * Compile multiple styles into a single optimized style
 */
export const compileStyles = (...names: StyleName[]): CompiledStyle => {
  const cacheKey = names.join(':');
  
  const cached = styleCache.get(cacheKey);
  if (cached) return cached;
  
  const openStack: string[] = [];
  const closeStack: string[] = [];
  
  for (const name of names) {
    if (OPEN[name]) {
      openStack.push(OPEN[name]);
      closeStack.unshift(CLOSE[name]); // Reverse order for proper nesting
    }
  }
  
  const compiled: CompiledStyle = {
    open: openStack.join(''),
    close: closeStack.join(''),
    openStack,
    closeStack,
  };
  
  // Cache management
  if (styleCache.size >= MAX_CACHE_SIZE) {
    const firstKey = styleCache.keys().next().value;
    if (firstKey) styleCache.delete(firstKey);
  }
  styleCache.set(cacheKey, compiled);
  
  return compiled;
};

/**
 * Apply compiled style to text
 */
export const applyCompiledStyle = (text: string, style: CompiledStyle): string => {
  if (detectColorLevel() === 0) return text;
  if (text === '') return '';
  
  const str = String(text);
  
  // Handle nesting
  if (!str.includes(style.close)) {
    return style.open + str + style.close;
  }
  
  return style.open + str.replaceAll(style.close, style.close + style.open) + style.close;
};

/**
 * Create RGB style definition
 */
export const createRgbStyle = (r: number, g: number, b: number, isBg = false): StyleDef => {
  const level = detectColorLevel();
  
  if (level >= 3) {
    return {
      open: isBg ? `${ESC}48;2;${r};${g};${b}m` : `${ESC}38;2;${r};${g};${b}m`,
      close: isBg ? CLOSE_BG : CLOSE_FG,
    };
  }
  
  if (level >= 2) {
    const code = rgbToAnsi256(r, g, b);
    return {
      open: isBg ? `${ESC}48;5;${code}m` : `${ESC}38;5;${code}m`,
      close: isBg ? CLOSE_BG : CLOSE_FG,
    };
  }
  
  return { open: '', close: '' };
};

/**
 * Create hex color style
 */
export const createHexStyle = (hex: string, isBg = false): StyleDef => {
  const [r, g, b] = hexToRgb(hex);
  return createRgbStyle(r, g, b, isBg);
};

/**
 * Create HSL color style
 */
export const createHslStyle = (h: number, s: number, l: number, isBg = false): StyleDef => {
  const [r, g, b] = hslToRgb(h, s, l);
  return createRgbStyle(r, g, b, isBg);
};

/**
 * Create ANSI 256 style
 */
export const createAnsi256Style = (code: number, isBg = false): StyleDef => {
  if (detectColorLevel() < 2) {
    return { open: '', close: '' };
  }
  
  return {
    open: isBg ? `${ESC}48;5;${code}m` : `${ESC}38;5;${code}m`,
    close: isBg ? CLOSE_BG : CLOSE_FG,
  };
};

/**
 * Style composer for building complex styles
 */
export class StyleComposer {
  private styles: StyleDef[] = [];
  
  /**
   * Add a named style
   */
  add(name: StyleName): this {
    this.styles.push(getStyleDef(name));
    return this;
  }
  
  /**
   * Add RGB color
   */
  rgb(r: number, g: number, b: number): this {
    this.styles.push(createRgbStyle(r, g, b));
    return this;
  }
  
  /**
   * Add RGB background
   */
  bgRgb(r: number, g: number, b: number): this {
    this.styles.push(createRgbStyle(r, g, b, true));
    return this;
  }
  
  /**
   * Add hex color
   */
  hex(color: string): this {
    this.styles.push(createHexStyle(color));
    return this;
  }
  
  /**
   * Add hex background
   */
  bgHex(color: string): this {
    this.styles.push(createHexStyle(color, true));
    return this;
  }
  
  /**
   * Add HSL color
   */
  hsl(h: number, s: number, l: number): this {
    this.styles.push(createHslStyle(h, s, l));
    return this;
  }
  
  /**
   * Add ANSI 256 color
   */
  ansi256(code: number): this {
    this.styles.push(createAnsi256Style(code));
    return this;
  }
  
  /**
   * Compile all styles
   */
  compile(): CompiledStyle {
    const openStack = this.styles.map(s => s.open).filter(Boolean);
    const closeStack = this.styles.map(s => s.close).filter(Boolean).reverse();
    
    return {
      open: openStack.join(''),
      close: closeStack.join(''),
      openStack,
      closeStack,
    };
  }
  
  /**
   * Apply styles to text
   */
  apply(text: string): string {
    return applyCompiledStyle(text, this.compile());
  }
  
  /**
   * Create a reusable style function
   */
  build(): (text: string) => string {
    const compiled = this.compile();
    return (text: string) => applyCompiledStyle(text, compiled);
  }
  
  /**
   * Reset composer
   */
  reset(): this {
    this.styles = [];
    return this;
  }
}

/**
 * Create a new style composer
 */
export const composer = (): StyleComposer => new StyleComposer();

/**
 * Style presets for common use cases
 */
export const presets = {
  error: compileStyles('bold', 'red'),
  warning: compileStyles('bold', 'yellow'),
  success: compileStyles('bold', 'green'),
  info: compileStyles('bold', 'blue'),
  muted: compileStyles('dim', 'gray'),
  highlight: compileStyles('bold', 'cyan'),
  link: compileStyles('underline', 'blue'),
  code: compileStyles('bgBlackBright', 'white'),
  heading: compileStyles('bold', 'underline'),
  deprecated: compileStyles('strikethrough', 'dim'),
};

/**
 * Apply preset style
 */
export const preset = (name: keyof typeof presets, text: string): string => {
  return applyCompiledStyle(text, presets[name]);
};

/**
 * Semantic style helpers
 */
export const semantic = {
  error: (text: string) => applyCompiledStyle(text, presets.error),
  warning: (text: string) => applyCompiledStyle(text, presets.warning),
  success: (text: string) => applyCompiledStyle(text, presets.success),
  info: (text: string) => applyCompiledStyle(text, presets.info),
  muted: (text: string) => applyCompiledStyle(text, presets.muted),
  highlight: (text: string) => applyCompiledStyle(text, presets.highlight),
  link: (text: string) => applyCompiledStyle(text, presets.link),
  code: (text: string) => applyCompiledStyle(text, presets.code),
  heading: (text: string) => applyCompiledStyle(text, presets.heading),
  deprecated: (text: string) => applyCompiledStyle(text, presets.deprecated),
};

/**
 * Conditional styling based on value
 */
export const conditional = <T>(
  value: T,
  conditions: Array<{ test: (v: T) => boolean; style: CompiledStyle }>,
  fallback?: CompiledStyle
): ((text: string) => string) => {
  for (const { test, style } of conditions) {
    if (test(value)) {
      return (text: string) => applyCompiledStyle(text, style);
    }
  }
  
  if (fallback) {
    return (text: string) => applyCompiledStyle(text, fallback);
  }
  
  return (text: string) => text;
};

/**
 * Style based on numeric thresholds
 */
export const threshold = (
  value: number,
  levels: Array<{ max: number; style: CompiledStyle }>
): CompiledStyle | null => {
  for (const { max, style } of levels.sort((a, b) => a.max - b.max)) {
    if (value <= max) return style;
  }
  return null;
};

/**
 * Clear style cache
 */
export const clearStyleCache = (): void => {
  styleCache.clear();
};

/**
 * Get cache stats
 */
export const getStyleCacheStats = () => ({
  size: styleCache.size,
  maxSize: MAX_CACHE_SIZE,
});