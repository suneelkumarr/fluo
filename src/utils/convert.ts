/**
 * BLITZ - Color Conversion Utilities
 * Comprehensive color format conversion functions
 */

import type { RgbColor, HslColor } from '../types';

/**
 * HSV color tuple
 */
export type HsvColor = [h: number, s: number, v: number];

/**
 * CMYK color tuple
 */
export type CmykColor = [c: number, m: number, y: number, k: number];

/**
 * LAB color tuple
 */
export type LabColor = [l: number, a: number, b: number];

/**
 * XYZ color tuple
 */
export type XyzColor = [x: number, y: number, z: number];

/**
 * Color object formats
 */
export interface RgbObject {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HslObject {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export interface HsvObject {
  h: number;
  s: number;
  v: number;
  a?: number;
}

// ============================================
// HEX Conversions
// ============================================

/**
 * Parse hex color to RGB
 * Supports: #RGB, #RGBA, #RRGGBB, #RRGGBBAA
 * 
 * @example
 * ```ts
 * hexToRgb('#FF0000'); // [255, 0, 0]
 * hexToRgb('#F00');    // [255, 0, 0]
 * hexToRgb('FF0000');  // [255, 0, 0]
 * ```
 */
export const hexToRgb = (hex: string): RgbColor => {
  let h = hex.replace(/^#/, '');
  
  // Expand shorthand
  if (h.length === 3 || h.length === 4) {
    h = h.split('').map(c => c + c).join('');
  }
  
  // Remove alpha channel if present
  if (h.length === 8) {
    h = h.slice(0, 6);
  }
  
  const num = parseInt(h, 16);
  
  return [
    (num >> 16) & 255,
    (num >> 8) & 255,
    num & 255,
  ];
};

/**
 * Parse hex color to RGBA
 * 
 * @example
 * ```ts
 * hexToRgba('#FF000080'); // [255, 0, 0, 0.5]
 * ```
 */
export const hexToRgba = (hex: string): [number, number, number, number] => {
  let h = hex.replace(/^#/, '');
  
  // Expand shorthand
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('') + 'FF';
  } else if (h.length === 4) {
    h = h.split('').map(c => c + c).join('');
  } else if (h.length === 6) {
    h = h + 'FF';
  }
  
  const num = parseInt(h, 16);
  
  return [
    (num >> 24) & 255,
    (num >> 16) & 255,
    (num >> 8) & 255,
    (num & 255) / 255,
  ];
};

/**
 * Convert RGB to hex
 * 
 * @example
 * ```ts
 * rgbToHex(255, 0, 0);     // '#FF0000'
 * rgbToHex([255, 0, 0]);   // '#FF0000'
 * ```
 */
export function rgbToHex(r: number, g: number, b: number): string;
export function rgbToHex(rgb: RgbColor): string;
export function rgbToHex(rOrRgb: number | RgbColor, g?: number, b?: number): string {
  let r: number;
  
  if (Array.isArray(rOrRgb)) {
    [r, g, b] = rOrRgb;
  } else {
    r = rOrRgb;
  }
  
  return '#' + [r, g!, b!]
    .map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
};

/**
 * Convert RGBA to hex with alpha
 */
export const rgbaToHex = (r: number, g: number, b: number, a: number): string => {
  const alpha = Math.round(a * 255).toString(16).padStart(2, '0');
  return rgbToHex(r, g, b) + alpha.toUpperCase();
};

// ============================================
// HSL Conversions
// ============================================

/**
 * Convert HSL to RGB
 * 
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param l Lightness (0-100)
 * 
 * @example
 * ```ts
 * hslToRgb(0, 100, 50);   // [255, 0, 0]
 * hslToRgb(120, 100, 50); // [0, 255, 0]
 * ```
 */
export const hslToRgb = (h: number, s: number, l: number): RgbColor => {
  // Normalize
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
};

/**
 * Convert RGB to HSL
 * 
 * @example
 * ```ts
 * rgbToHsl(255, 0, 0);   // [0, 100, 50]
 * rgbToHsl(0, 255, 0);   // [120, 100, 50]
 * ```
 */
export const rgbToHsl = (r: number, g: number, b: number): HslColor => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return [
    Math.round(h * 360),
    Math.round(s * 100),
    Math.round(l * 100),
  ];
};

/**
 * Convert hex to HSL
 */
export const hexToHsl = (hex: string): HslColor => {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHsl(r, g, b);
};

/**
 * Convert HSL to hex
 */
export const hslToHex = (h: number, s: number, l: number): string => {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
};

// ============================================
// HSV/HSB Conversions
// ============================================

/**
 * Convert HSV to RGB
 * 
 * @param h Hue (0-360)
 * @param s Saturation (0-100)
 * @param v Value/Brightness (0-100)
 */
export const hsvToRgb = (h: number, s: number, v: number): RgbColor => {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  v = Math.max(0, Math.min(100, v)) / 100;
  
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  
  let r = 0, g = 0, b = 0;
  
  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }
  
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
};

/**
 * Convert RGB to HSV
 */
export const rgbToHsv = (r: number, g: number, b: number): HsvColor => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  
  if (max !== min) {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return [
    Math.round(h * 360),
    Math.round(s * 100),
    Math.round(v * 100),
  ];
};

/**
 * Convert HSL to HSV
 */
export const hslToHsv = (h: number, s: number, l: number): HsvColor => {
  const [r, g, b] = hslToRgb(h, s, l);
  return rgbToHsv(r, g, b);
};

/**
 * Convert HSV to HSL
 */
export const hsvToHsl = (h: number, s: number, v: number): HslColor => {
  const [r, g, b] = hsvToRgb(h, s, v);
  return rgbToHsl(r, g, b);
};

// ============================================
// CMYK Conversions
// ============================================

/**
 * Convert RGB to CMYK
 * 
 * @returns CMYK values (0-100)
 */
export const rgbToCmyk = (r: number, g: number, b: number): CmykColor => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const k = 1 - Math.max(r, g, b);
  
  if (k === 1) {
    return [0, 0, 0, 100];
  }
  
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  
  return [
    Math.round(c * 100),
    Math.round(m * 100),
    Math.round(y * 100),
    Math.round(k * 100),
  ];
};

/**
 * Convert CMYK to RGB
 * 
 * @param c Cyan (0-100)
 * @param m Magenta (0-100)
 * @param y Yellow (0-100)
 * @param k Black/Key (0-100)
 */
export const cmykToRgb = (c: number, m: number, y: number, k: number): RgbColor => {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;
  
  return [
    Math.round(255 * (1 - c) * (1 - k)),
    Math.round(255 * (1 - m) * (1 - k)),
    Math.round(255 * (1 - y) * (1 - k)),
  ];
};

// ============================================
// ANSI 256 Conversions
// ============================================

/**
 * Convert RGB to ANSI 256 color code
 */
export const rgbToAnsi256 = (r: number, g: number, b: number): number => {
  // Grayscale check
  if (r === g && g === b) {
    if (r < 8) return 16;
    if (r > 248) return 231;
    return Math.round(((r - 8) / 247) * 24) + 232;
  }
  
  // Color cube (6x6x6)
  return (
    16 +
    36 * Math.round((r / 255) * 5) +
    6 * Math.round((g / 255) * 5) +
    Math.round((b / 255) * 5)
  );
};

/**
 * Convert ANSI 256 color code to RGB
 */
export const ansi256ToRgb = (code: number): RgbColor => {
  // Clamp
  code = Math.max(0, Math.min(255, code));
  
  // Standard colors (0-15)
  if (code < 16) {
    const standard: RgbColor[] = [
      [0, 0, 0],       // 0: Black
      [128, 0, 0],     // 1: Red
      [0, 128, 0],     // 2: Green
      [128, 128, 0],   // 3: Yellow
      [0, 0, 128],     // 4: Blue
      [128, 0, 128],   // 5: Magenta
      [0, 128, 128],   // 6: Cyan
      [192, 192, 192], // 7: White
      [128, 128, 128], // 8: Bright Black (Gray)
      [255, 0, 0],     // 9: Bright Red
      [0, 255, 0],     // 10: Bright Green
      [255, 255, 0],   // 11: Bright Yellow
      [0, 0, 255],     // 12: Bright Blue
      [255, 0, 255],   // 13: Bright Magenta
      [0, 255, 255],   // 14: Bright Cyan
      [255, 255, 255], // 15: Bright White
    ];
    return standard[code];
  }
  
  // Color cube (16-231)
  if (code < 232) {
    const c = code - 16;
    const r = Math.floor(c / 36);
    const g = Math.floor((c % 36) / 6);
    const b = c % 6;
    
    return [
      r ? r * 40 + 55 : 0,
      g ? g * 40 + 55 : 0,
      b ? b * 40 + 55 : 0,
    ];
  }
  
  // Grayscale (232-255)
  const gray = (code - 232) * 10 + 8;
  return [gray, gray, gray];
};

/**
 * Convert hex to ANSI 256
 */
export const hexToAnsi256 = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex);
  return rgbToAnsi256(r, g, b);
};

/**
 * Convert ANSI 256 to hex
 */
export const ansi256ToHex = (code: number): string => {
  const [r, g, b] = ansi256ToRgb(code);
  return rgbToHex(r, g, b);
};

// ============================================
// ANSI 16 (Basic) Conversions
// ============================================

/**
 * Basic ANSI colors mapping
 */
const ANSI_16_COLORS: Record<number, RgbColor> = {
  0: [0, 0, 0],       // Black
  1: [128, 0, 0],     // Red
  2: [0, 128, 0],     // Green
  3: [128, 128, 0],   // Yellow
  4: [0, 0, 128],     // Blue
  5: [128, 0, 128],   // Magenta
  6: [0, 128, 128],   // Cyan
  7: [192, 192, 192], // White
  8: [128, 128, 128], // Bright Black
  9: [255, 0, 0],     // Bright Red
  10: [0, 255, 0],    // Bright Green
  11: [255, 255, 0],  // Bright Yellow
  12: [0, 0, 255],    // Bright Blue
  13: [255, 0, 255],  // Bright Magenta
  14: [0, 255, 255],  // Bright Cyan
  15: [255, 255, 255], // Bright White
};

/**
 * Convert RGB to ANSI 16 color code
 */
export const rgbToAnsi16 = (r: number, g: number, b: number): number => {
  // Find closest color
  let closest = 0;
  let closestDist = Infinity;
  
  for (const [code, rgb] of Object.entries(ANSI_16_COLORS)) {
    const dist = Math.sqrt(
      Math.pow(r - rgb[0], 2) +
      Math.pow(g - rgb[1], 2) +
      Math.pow(b - rgb[2], 2)
    );
    
    if (dist < closestDist) {
      closestDist = dist;
      closest = parseInt(code);
    }
  }
  
  return closest;
};

/**
 * Convert ANSI 16 to RGB
 */
export const ansi16ToRgb = (code: number): RgbColor => {
  return ANSI_16_COLORS[code] || [0, 0, 0];
};

// ============================================
// Color Parsing & Detection
// ============================================

/**
 * Color format types
 */
export type ColorFormat = 
  | 'hex' 
  | 'hex3' 
  | 'hex4' 
  | 'hex8' 
  | 'rgb' 
  | 'rgba' 
  | 'hsl' 
  | 'hsla' 
  | 'hsv' 
  | 'named' 
  | 'ansi256' 
  | 'unknown';

/**
 * Detect color format
 */
export const detectColorFormat = (color: string): ColorFormat => {
  color = color.trim().toLowerCase();
  
  // Hex formats
  if (/^#?[0-9a-f]{3}$/i.test(color)) return 'hex3';
  if (/^#?[0-9a-f]{4}$/i.test(color)) return 'hex4';
  if (/^#?[0-9a-f]{6}$/i.test(color)) return 'hex';
  if (/^#?[0-9a-f]{8}$/i.test(color)) return 'hex8';
  
  // RGB(A)
  if (/^rgba?\s*\(/.test(color)) {
    return color.includes(',') && color.split(',').length === 4 ? 'rgba' : 'rgb';
  }
  
  // HSL(A)
  if (/^hsla?\s*\(/.test(color)) {
    return color.includes(',') && color.split(',').length === 4 ? 'hsla' : 'hsl';
  }
  
  // HSV/HSB
  if (/^hsv\s*\(/.test(color) || /^hsb\s*\(/.test(color)) {
    return 'hsv';
  }
  
  // Named colors
  if (/^[a-z]+$/.test(color)) {
    return 'named';
  }
  
  // ANSI 256
  if (/^\d{1,3}$/.test(color)) {
    const num = parseInt(color);
    if (num >= 0 && num <= 255) return 'ansi256';
  }
  
  return 'unknown';
};

/**
 * Parse any color format to RGB
 */
export const parseColor = (color: string): RgbColor | null => {
  const format = detectColorFormat(color);
  
  switch (format) {
    case 'hex':
    case 'hex3':
    case 'hex4':
    case 'hex8':
      return hexToRgb(color);
    
    case 'rgb':
    case 'rgba': {
      const match = color.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
      if (match) {
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      }
      return null;
    }
    
    case 'hsl':
    case 'hsla': {
      const match = color.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
      if (match) {
        return hslToRgb(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
      }
      return null;
    }
    
    case 'hsv': {
      const match = color.match(/hsv\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/i);
      if (match) {
        return hsvToRgb(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
      }
      return null;
    }
    
    case 'ansi256': {
      return ansi256ToRgb(parseInt(color));
    }
    
    case 'named': {
      return namedColorToRgb(color);
    }
    
    default:
      return null;
  }
};

// ============================================
// Named Colors
// ============================================

/**
 * CSS named colors (subset of most common)
 */
const NAMED_COLORS: Record<string, RgbColor> = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  red: [255, 0, 0],
  green: [0, 128, 0],
  blue: [0, 0, 255],
  yellow: [255, 255, 0],
  cyan: [0, 255, 255],
  magenta: [255, 0, 255],
  gray: [128, 128, 128],
  grey: [128, 128, 128],
  silver: [192, 192, 192],
  maroon: [128, 0, 0],
  olive: [128, 128, 0],
  lime: [0, 255, 0],
  aqua: [0, 255, 255],
  teal: [0, 128, 128],
  navy: [0, 0, 128],
  fuchsia: [255, 0, 255],
  purple: [128, 0, 128],
  orange: [255, 165, 0],
  pink: [255, 192, 203],
  brown: [165, 42, 42],
  gold: [255, 215, 0],
  coral: [255, 127, 80],
  salmon: [250, 128, 114],
  tomato: [255, 99, 71],
  crimson: [220, 20, 60],
  indigo: [75, 0, 130],
  violet: [238, 130, 238],
  plum: [221, 160, 221],
  orchid: [218, 112, 214],
  turquoise: [64, 224, 208],
  skyblue: [135, 206, 235],
  steelblue: [70, 130, 180],
  chocolate: [210, 105, 30],
  sienna: [160, 82, 45],
  tan: [210, 180, 140],
  beige: [245, 245, 220],
  ivory: [255, 255, 240],
  lavender: [230, 230, 250],
  linen: [250, 240, 230],
  snow: [255, 250, 250],
  azure: [240, 255, 255],
  honeydew: [240, 255, 240],
  mintcream: [245, 255, 250],
  aliceblue: [240, 248, 255],
  ghostwhite: [248, 248, 255],
  seashell: [255, 245, 238],
  oldlace: [253, 245, 230],
  wheat: [245, 222, 179],
  moccasin: [255, 228, 181],
  peachpuff: [255, 218, 185],
  mistyrose: [255, 228, 225],
  papayawhip: [255, 239, 213],
  blanchedalmond: [255, 235, 205],
  bisque: [255, 228, 196],
  navajowhite: [255, 222, 173],
};

/**
 * Convert named color to RGB
 */
export const namedColorToRgb = (name: string): RgbColor | null => {
  return NAMED_COLORS[name.toLowerCase()] || null;
};

/**
 * Get closest named color
 */
export const rgbToNamedColor = (r: number, g: number, b: number): string => {
  let closest = 'black';
  let closestDist = Infinity;
  
  for (const [name, rgb] of Object.entries(NAMED_COLORS)) {
    const dist = Math.sqrt(
      Math.pow(r - rgb[0], 2) +
      Math.pow(g - rgb[1], 2) +
      Math.pow(b - rgb[2], 2)
    );
    
    if (dist < closestDist) {
      closestDist = dist;
      closest = name;
    }
  }
  
  return closest;
};

// ============================================
// Color Manipulation
// ============================================

/**
 * Lighten a color
 */
export const lighten = (color: RgbColor | string, amount: number): RgbColor => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  const [h, s, l] = rgbToHsl(...rgb);
  return hslToRgb(h, s, Math.min(100, l + amount));
};

/**
 * Darken a color
 */
export const darken = (color: RgbColor | string, amount: number): RgbColor => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  const [h, s, l] = rgbToHsl(...rgb);
  return hslToRgb(h, s, Math.max(0, l - amount));
};

/**
 * Saturate a color
 */
export const saturate = (color: RgbColor | string, amount: number): RgbColor => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  const [h, s, l] = rgbToHsl(...rgb);
  return hslToRgb(h, Math.min(100, s + amount), l);
};

/**
 * Desaturate a color
 */
export const desaturate = (color: RgbColor | string, amount: number): RgbColor => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  const [h, s, l] = rgbToHsl(...rgb);
  return hslToRgb(h, Math.max(0, s - amount), l);
};

/**
 * Rotate hue
 */
export const rotateHue = (color: RgbColor | string, degrees: number): RgbColor => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  const [h, s, l] = rgbToHsl(...rgb);
  return hslToRgb((h + degrees) % 360, s, l);
};

/**
 * Get complementary color
 */
export const complement = (color: RgbColor | string): RgbColor => {
  return rotateHue(color, 180);
};

/**
 * Invert color
 */
export const invert = (color: RgbColor | string): RgbColor => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  return [255 - rgb[0], 255 - rgb[1], 255 - rgb[2]];
};

/**
 * Convert to grayscale
 */
export const grayscale = (color: RgbColor | string): RgbColor => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  const gray = Math.round(0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);
  return [gray, gray, gray];
};

/**
 * Mix two colors
 */
export const mix = (
  color1: RgbColor | string,
  color2: RgbColor | string,
  weight: number = 0.5
): RgbColor => {
  const rgb1 = typeof color1 === 'string' ? hexToRgb(color1) : color1;
  const rgb2 = typeof color2 === 'string' ? hexToRgb(color2) : color2;
  
  return [
    Math.round(rgb1[0] * (1 - weight) + rgb2[0] * weight),
    Math.round(rgb1[1] * (1 - weight) + rgb2[1] * weight),
    Math.round(rgb1[2] * (1 - weight) + rgb2[2] * weight),
  ];
};

/**
 * Get contrast ratio between two colors
 */
export const contrastRatio = (
  color1: RgbColor | string,
  color2: RgbColor | string
): number => {
  const rgb1 = typeof color1 === 'string' ? hexToRgb(color1) : color1;
  const rgb2 = typeof color2 === 'string' ? hexToRgb(color2) : color2;
  
  const lum1 = luminance(rgb1);
  const lum2 = luminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Get relative luminance
 */
export const luminance = (color: RgbColor | string): number => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  
  const [r, g, b] = rgb.map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Check if color is dark
 */
export const isDark = (color: RgbColor | string): boolean => {
  return luminance(color) < 0.5;
};

/**
 * Check if color is light
 */
export const isLight = (color: RgbColor | string): boolean => {
  return !isDark(color);
};

/**
 * Get best text color (black or white) for background
 */
export const getContrastText = (backgroundColor: RgbColor | string): 'black' | 'white' => {
  return isDark(backgroundColor) ? 'white' : 'black';
};

// ============================================
// Color Palette Generation
// ============================================

/**
 * Generate analogous colors
 */
export const analogous = (color: RgbColor | string, count: number = 3): RgbColor[] => {
  const spread = 30;
  const colors: RgbColor[] = [];
  
  for (let i = 0; i < count; i++) {
    const offset = (i - Math.floor(count / 2)) * spread;
    colors.push(rotateHue(color, offset));
  }
  
  return colors;
};

/**
 * Generate triadic colors
 */
export const triadic = (color: RgbColor | string): [RgbColor, RgbColor, RgbColor] => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  return [
    rgb,
    rotateHue(rgb, 120),
    rotateHue(rgb, 240),
  ];
};

/**
 * Generate tetradic (square) colors
 */
export const tetradic = (color: RgbColor | string): [RgbColor, RgbColor, RgbColor, RgbColor] => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  return [
    rgb,
    rotateHue(rgb, 90),
    rotateHue(rgb, 180),
    rotateHue(rgb, 270),
  ];
};

/**
 * Generate split-complementary colors
 */
export const splitComplementary = (color: RgbColor | string): [RgbColor, RgbColor, RgbColor] => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  return [
    rgb,
    rotateHue(rgb, 150),
    rotateHue(rgb, 210),
  ];
};

/**
 * Generate monochromatic shades
 */
export const monochromatic = (color: RgbColor | string, count: number = 5): RgbColor[] => {
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  const [h, s] = rgbToHsl(...rgb);
  const colors: RgbColor[] = [];
  
  const step = 100 / (count + 1);
  
  for (let i = 1; i <= count; i++) {
    colors.push(hslToRgb(h, s, i * step));
  }
  
  return colors;
};

// Default export
export default {
  hexToRgb,
  rgbToHex,
  hslToRgb,
  rgbToHsl,
  hsvToRgb,
  rgbToHsv,
  rgbToAnsi256,
  ansi256ToRgb,
  parseColor,
  detectColorFormat,
  lighten,
  darken,
  saturate,
  desaturate,
  mix,
  isDark,
  isLight,
  getContrastText,
};