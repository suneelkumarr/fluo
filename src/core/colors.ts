/**
 * BLITZ - Color Utilities
 * High-performance color conversion functions
 */

import type { RgbColor, HslColor } from '../types';

// Hex color cache for repeated conversions
const hexCache = new Map<string, RgbColor>();
const MAX_CACHE_SIZE = 1000;

/**
 * Parse hex color to RGB
 * Supports #RGB, #RGBA, #RRGGBB, #RRGGBBAA
 */
export const hexToRgb = (hex: string): RgbColor => {
  // Check cache
  const cached = hexCache.get(hex);
  if (cached) return cached;
  
  // Remove # prefix
  let h = hex.startsWith('#') ? hex.slice(1) : hex;
  
  // Expand shorthand (#RGB -> #RRGGBB)
  if (h.length === 3 || h.length === 4) {
    h = h.split('').map(c => c + c).join('');
  }
  
  // Parse
  const num = parseInt(h, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  
  const result: RgbColor = [r, g, b];
  
  // Cache (with size limit)
  if (hexCache.size >= MAX_CACHE_SIZE) {
    const firstKey = hexCache.keys().next().value;
    if (firstKey) hexCache.delete(firstKey);
  }
  hexCache.set(hex, result);
  
  return result;
};

/**
 * Convert RGB to hex
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Convert HSL to RGB
 */
export const hslToRgb = (h: number, s: number, l: number): RgbColor => {
  // Normalize values
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
 * Convert RGB to ANSI 256
 */
export const rgbToAnsi256 = (r: number, g: number, b: number): number => {
  // Grayscale check
  if (r === g && g === b) {
    if (r < 8) return 16;
    if (r > 248) return 231;
    return Math.round(((r - 8) / 247) * 24) + 232;
  }
  
  // Color cube
  return (
    16 +
    36 * Math.round((r / 255) * 5) +
    6 * Math.round((g / 255) * 5) +
    Math.round((b / 255) * 5)
  );
};

/**
 * Convert ANSI 256 to RGB
 */
export const ansi256ToRgb = (code: number): RgbColor => {
  // Standard colors (0-15)
  if (code < 16) {
    const standard: RgbColor[] = [
      [0, 0, 0], [128, 0, 0], [0, 128, 0], [128, 128, 0],
      [0, 0, 128], [128, 0, 128], [0, 128, 128], [192, 192, 192],
      [128, 128, 128], [255, 0, 0], [0, 255, 0], [255, 255, 0],
      [0, 0, 255], [255, 0, 255], [0, 255, 255], [255, 255, 255],
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
 * Interpolate between two colors
 */
export const interpolateRgb = (
  color1: RgbColor,
  color2: RgbColor,
  t: number
): RgbColor => {
  const t1 = Math.max(0, Math.min(1, t));
  return [
    Math.round(color1[0] + (color2[0] - color1[0]) * t1),
    Math.round(color1[1] + (color2[1] - color1[1]) * t1),
    Math.round(color1[2] + (color2[2] - color1[2]) * t1),
  ];
};

/**
 * Interpolate between two colors using HSL
 */
export const interpolateHsl = (
  color1: RgbColor,
  color2: RgbColor,
  t: number
): RgbColor => {
  const hsl1 = rgbToHsl(...color1);
  const hsl2 = rgbToHsl(...color2);
  
  // Handle hue interpolation (shortest path)
  let h1 = hsl1[0];
  let h2 = hsl2[0];
  const hDiff = h2 - h1;
  
  if (Math.abs(hDiff) > 180) {
    if (hDiff > 0) {
      h1 += 360;
    } else {
      h2 += 360;
    }
  }
  
  const h = (h1 + (h2 - h1) * t) % 360;
  const s = hsl1[1] + (hsl2[1] - hsl1[1]) * t;
  const l = hsl1[2] + (hsl2[2] - hsl1[2]) * t;
  
  return hslToRgb(h, s, l);
};

/**
 * Get contrasting text color (black or white)
 */
export const getContrastColor = (r: number, g: number, b: number): 'black' | 'white' => {
  // Using relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? 'black' : 'white';
};

/**
 * Lighten a color
 */
export const lighten = (rgb: RgbColor, amount: number): RgbColor => {
  const hsl = rgbToHsl(...rgb);
  hsl[2] = Math.min(100, hsl[2] + amount);
  return hslToRgb(...hsl);
};

/**
 * Darken a color
 */
export const darken = (rgb: RgbColor, amount: number): RgbColor => {
  const hsl = rgbToHsl(...rgb);
  hsl[2] = Math.max(0, hsl[2] - amount);
  return hslToRgb(...hsl);
};

/**
 * Saturate a color
 */
export const saturate = (rgb: RgbColor, amount: number): RgbColor => {
  const hsl = rgbToHsl(...rgb);
  hsl[1] = Math.min(100, hsl[1] + amount);
  return hslToRgb(...hsl);
};

/**
 * Desaturate a color
 */
export const desaturate = (rgb: RgbColor, amount: number): RgbColor => {
  const hsl = rgbToHsl(...rgb);
  hsl[1] = Math.max(0, hsl[1] - amount);
  return hslToRgb(...hsl);
};