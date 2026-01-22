
import { STYLES, OPEN, CLOSE, ESC, CLOSE_FG, CLOSE_BG } from './ansi';
import { detectColorLevel } from './detect';
import { hexToRgb, hslToRgb, rgbToAnsi256 } from './colors';
import type { Styler, ColorLevel, StyleName } from '../types';

// Current color level (module-local state)
let colorLevel: ColorLevel = detectColorLevel();

// Check if styling is enabled
const isEnabled = (): boolean => colorLevel > 0;

/**
 * Create styled string with proper nesting support
 */
export const applyStyle = (
  text: string,
  openCode: string,
  closeCode: string
): string => {
  if (!isEnabled()) return text;
  if (text === '') return '';
  
  // Handle nested styles by replacing close codes
  const str = String(text);
  
  // Optimization: skip processing if no nesting detected
  if (!str.includes(closeCode)) {
    return openCode + str + closeCode;
  }
  
  // Replace nested close codes with open + close to maintain style
  return openCode + str.replaceAll(closeCode, closeCode + openCode) + closeCode;
};

/**
 * Create RGB styled string
 */
export const applyRgb = (
  text: string,
  r: number,
  g: number,
  b: number,
  isBg: boolean
): string => {
  if (!isEnabled()) return String(text);
  
  const level = colorLevel;
  
  if (level >= 3) {
    // TrueColor
    const open = isBg ? `${ESC}48;2;${r};${g};${b}m` : `${ESC}38;2;${r};${g};${b}m`;
    const close = isBg ? CLOSE_BG : CLOSE_FG;
    return applyStyle(String(text), open, close);
  }
  
  if (level >= 2) {
    // 256 colors
    const code = rgbToAnsi256(r, g, b);
    const open = isBg ? `${ESC}48;5;${code}m` : `${ESC}38;5;${code}m`;
    const close = isBg ? CLOSE_BG : CLOSE_FG;
    return applyStyle(String(text), open, close);
  }
  
  // Fallback to basic color approximation
  return String(text);
};

/**
 * Create ANSI 256 styled string
 */
export const applyAnsi256 = (
  text: string,
  code: number,
  isBg: boolean
): string => {
  if (!isEnabled()) return String(text);
  if (colorLevel < 2) return String(text);
  
  const open = isBg ? `${ESC}48;5;${code}m` : `${ESC}38;5;${code}m`;
  const close = isBg ? CLOSE_BG : CLOSE_FG;
  return applyStyle(String(text), open, close);
};

// Type for internal style builder
interface StyleBuilder {
  _open: string;
  _close: string;
}

/**
 * Create a chainable style builder
 */
export const createBuilder = (open = '', close = ''): Styler => {
  // The callable function
  const builder = ((
    first: string | number | unknown | TemplateStringsArray,
    ...args: unknown[]
  ): string => {
    // Template literal support
    if (Array.isArray(first) && 'raw' in first) {
      const template = first as TemplateStringsArray;
      let result = template[0];
      for (let i = 0; i < args.length; i++) {
        result += String(args[i]) + (template[i + 1] || '');
      }
      return applyStyle(result, open, close);
    }
    
    return applyStyle(String(first), open, close);
  }) as Styler & StyleBuilder;
  
  // Store current style
  builder._open = open;
  builder._close = close;
  
  // Add style getters
  for (const name of Object.keys(STYLES) as StyleName[]) {
    Object.defineProperty(builder, name, {
      get() {
        return createBuilder(
          open + OPEN[name],
          CLOSE[name] + close
        );
      },
      enumerable: true,
    });
  }
  
  // RGB methods
  builder.rgb = (r: number, g: number, b: number) => {
    const rgbOpen = colorLevel >= 3 
      ? `${ESC}38;2;${r};${g};${b}m`
      : colorLevel >= 2
        ? `${ESC}38;5;${rgbToAnsi256(r, g, b)}m`
        : '';
    return createBuilder(open + rgbOpen, CLOSE_FG + close);
  };
  
  builder.bgRgb = (r: number, g: number, b: number) => {
    const rgbOpen = colorLevel >= 3
      ? `${ESC}48;2;${r};${g};${b}m`
      : colorLevel >= 2
        ? `${ESC}48;5;${rgbToAnsi256(r, g, b)}m`
        : '';
    return createBuilder(open + rgbOpen, CLOSE_BG + close);
  };
  
  // Hex methods
  builder.hex = (color: string) => {
    const [r, g, b] = hexToRgb(color);
    return builder.rgb(r, g, b);
  };
  
  builder.bgHex = (color: string) => {
    const [r, g, b] = hexToRgb(color);
    return builder.bgRgb(r, g, b);
  };
  
  // HSL methods
  builder.hsl = (h: number, s: number, l: number) => {
    const [r, g, b] = hslToRgb(h, s, l);
    return builder.rgb(r, g, b);
  };
  
  builder.bgHsl = (h: number, s: number, l: number) => {
    const [r, g, b] = hslToRgb(h, s, l);
    return builder.bgRgb(r, g, b);
  };
  
  // ANSI 256 methods
  builder.ansi256 = (code: number) => {
    const ansiOpen = colorLevel >= 2 ? `${ESC}38;5;${code}m` : '';
    return createBuilder(open + ansiOpen, CLOSE_FG + close);
  };
  
  builder.bgAnsi256 = (code: number) => {
    const ansiOpen = colorLevel >= 2 ? `${ESC}48;5;${code}m` : '';
    return createBuilder(open + ansiOpen, CLOSE_BG + close);
  };
  
  return builder;
};

// Internal fluo instance
export const fluo = createBuilder();

// Configuration object
export const options = {
  get enabled() {
    return colorLevel > 0;
  },
  set enabled(value: boolean) {
    colorLevel = value ? detectColorLevel() || 1 : 0;
  },
  get level() {
    return colorLevel;
  },
  set level(value: ColorLevel) {
    colorLevel = value;
  },
};
