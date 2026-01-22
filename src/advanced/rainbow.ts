/**
 * BLITZ - Rainbow Text Effects
 * Create stunning rainbow and multi-color text effects
 */

import { ESC, CLOSE_FG } from '../core/ansi';
import { detectColorLevel } from '../core/detect';
import { hslToRgb, hexToRgb, rgbToHsl } from '../core/colors';
import type { RgbColor } from '../types';

/**
 * Rainbow options
 */
export interface RainbowOptions {
  /** Starting hue (0-360) */
  startHue?: number;
  /** Hue spread per character */
  spread?: number;
  /** Saturation (0-100) */
  saturation?: number;
  /** Lightness (0-100) */
  lightness?: number;
  /** Include background */
  background?: boolean;
  /** Animation frame (for animated rainbow) */
  frame?: number;
  /** Skip whitespace */
  preserveSpaces?: boolean;
}

/**
 * Apply rainbow colors to text
 */
export const rainbow = (text: string, options: RainbowOptions = {}): string => {
  const level = detectColorLevel();
  if (level < 3) return text;
  
  const {
    startHue = 0,
    spread = 32,
    saturation = 100,
    lightness = 50,
    background = false,
    frame = 0,
    preserveSpaces = true,
  } = options;
  
  const chars = [...text];
  let result = '';
  let colorIndex = 0;
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    
    // Preserve whitespace
    if (preserveSpaces && (char === ' ' || char === '\n' || char === '\t')) {
      result += char;
      continue;
    }
    
    // Calculate hue with animation offset
    const hue = (startHue + (colorIndex * spread) + (frame * 10)) % 360;
    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    
    if (background) {
      // Text color based on background brightness
      const textColor = lightness > 50 ? '0;0;0' : '255;255;255';
      result += `${ESC}48;2;${r};${g};${b}m${ESC}38;2;${textColor}m${char}`;
    } else {
      result += `${ESC}38;2;${r};${g};${b}m${char}`;
    }
    
    colorIndex++;
  }
  
  return result + (background ? `${ESC}49m${CLOSE_FG}` : CLOSE_FG);
};

/**
 * Neon glow effect
 */
export const neon = (text: string, color: string | RgbColor = '#00FF00'): string => {
  const level = detectColorLevel();
  if (level < 3) return text;
  
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  const [h, s] = rgbToHsl(...rgb);
  
  // Create bright version
  const brightRgb = hslToRgb(h, Math.min(100, s + 20), 80);
  
  const chars = [...text];
  let result = '';
  
  for (const char of chars) {
    if (char === ' ' || char === '\n') {
      result += char;
      continue;
    }
    
    // Apply bold + bright color for neon effect
    result += `${ESC}1m${ESC}38;2;${brightRgb[0]};${brightRgb[1]};${brightRgb[2]}m${char}`;
  }
  
  return result + `${ESC}22m${CLOSE_FG}`;
};

/**
 * Pastel rainbow (softer colors)
 */
export const pastelRainbow = (text: string, options: Omit<RainbowOptions, 'saturation' | 'lightness'> = {}): string => {
  return rainbow(text, {
    ...options,
    saturation: 60,
    lightness: 75,
  });
};

/**
 * Dark rainbow (deeper colors)
 */
export const darkRainbow = (text: string, options: Omit<RainbowOptions, 'saturation' | 'lightness'> = {}): string => {
  return rainbow(text, {
    ...options,
    saturation: 90,
    lightness: 35,
  });
};

/**
 * Fire effect (red to yellow)
 */
export const fire = (text: string, options: { frame?: number; preserveSpaces?: boolean } = {}): string => {
  const level = detectColorLevel();
  if (level < 3) return text;
  
  const { frame = 0, preserveSpaces = true } = options;
  
  const chars = [...text];
  let result = '';
  let colorIndex = 0;
  
  for (const char of chars) {
    if (preserveSpaces && (char === ' ' || char === '\n' || char === '\t')) {
      result += char;
      continue;
    }
    
    // Fire colors: red -> orange -> yellow
    const t = (colorIndex + frame) % 30;
    let r: number, g: number, b: number;
    
    if (t < 10) {
      // Red to orange
      r = 255;
      g = Math.floor((t / 10) * 165);
      b = 0;
    } else if (t < 20) {
      // Orange to yellow
      r = 255;
      g = 165 + Math.floor(((t - 10) / 10) * 90);
      b = 0;
    } else {
      // Yellow to red
      r = 255;
      g = Math.floor((1 - (t - 20) / 10) * 255);
      b = 0;
    }
    
    result += `${ESC}38;2;${r};${g};${b}m${char}`;
    colorIndex++;
  }
  
  return result + CLOSE_FG;
};

/**
 * Ice effect (white to cyan to blue)
 */
export const ice = (text: string, options: { frame?: number; preserveSpaces?: boolean } = {}): string => {
  const level = detectColorLevel();
  if (level < 3) return text;
  
  const { frame = 0, preserveSpaces = true } = options;
  
  const chars = [...text];
  let result = '';
  let colorIndex = 0;
  
  for (const char of chars) {
    if (preserveSpaces && (char === ' ' || char === '\n' || char === '\t')) {
      result += char;
      continue;
    }
    
    const t = ((colorIndex + frame) % 30) / 30;
    let r: number, g: number, b: number;
    
    if (t < 0.5) {
      // White to cyan
      r = Math.floor(255 * (1 - t * 2));
      g = 255;
      b = 255;
    } else {
      // Cyan to blue
      const t2 = (t - 0.5) * 2;
      r = 0;
      g = Math.floor(255 * (1 - t2));
      b = 255;
    }
    
    result += `${ESC}38;2;${r};${g};${b}m${char}`;
    colorIndex++;
  }
  
  return result + CLOSE_FG;
};

/**
 * Matrix effect (green shades)
 */
export const matrix = (text: string, options: { frame?: number; preserveSpaces?: boolean } = {}): string => {
  const level = detectColorLevel();
  if (level < 3) return text;
  
  const { frame = 0, preserveSpaces = true } = options;
  
  const chars = [...text];
  let result = '';
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    
    if (preserveSpaces && (char === ' ' || char === '\n' || char === '\t')) {
      result += char;
      continue;
    }
    
    // Random-ish brightness based on position and frame
    const brightness = Math.abs(Math.sin((i + frame) * 0.5)) * 155 + 100;
    const g = Math.floor(brightness);
    
    result += `${ESC}38;2;0;${g};0m${char}`;
  }
  
  return result + CLOSE_FG;
};

/**
 * Ocean effect (blue to cyan)
 */
export const ocean = (text: string, options: { frame?: number; preserveSpaces?: boolean } = {}): string => {
  const level = detectColorLevel();
  if (level < 3) return text;
  
  const { frame = 0, preserveSpaces = true } = options;
  
  const chars = [...text];
  let result = '';
  let colorIndex = 0;
  
  for (const char of chars) {
    if (preserveSpaces && (char === ' ' || char === '\n' || char === '\t')) {
      result += char;
      continue;
    }
    
    // Wave effect
    const wave = Math.sin((colorIndex + frame) * 0.3);
    const hue = 180 + wave * 40; // 140-220 (cyan to blue range)
    const [r, g, b] = hslToRgb(hue, 80, 50);
    
    result += `${ESC}38;2;${r};${g};${b}m${char}`;
    colorIndex++;
  }
  
  return result + CLOSE_FG;
};

/**
 * Sunset effect (orange to purple)
 */
export const sunset = (text: string, options: { preserveSpaces?: boolean } = {}): string => {
  const level = detectColorLevel();
  if (level < 3) return text;
  
  const { preserveSpaces = true } = options;
  
  const chars = [...text];
  const len = chars.filter(c => c !== ' ' && c !== '\n' && c !== '\t').length;
  let result = '';
  let colorIndex = 0;
  
  for (const char of chars) {
    if (preserveSpaces && (char === ' ' || char === '\n' || char === '\t')) {
      result += char;
      continue;
    }
    
    const t = len > 1 ? colorIndex / (len - 1) : 0;
    
    // Orange (30°) to Purple (280°)
    const hue = 30 + t * 250;
    const [r, g, b] = hslToRgb(hue, 85, 55);
    
    result += `${ESC}38;2;${r};${g};${b}m${char}`;
    colorIndex++;
  }
  
  return result + CLOSE_FG;
};

/**
 * Pulse effect (brightness oscillation)
 */
export const pulse = (
  text: string,
  color: string | RgbColor,
  options: { frame?: number; speed?: number; minBrightness?: number } = {}
): string => {
  const level = detectColorLevel();
  if (level < 3) return text;
  
  const { frame = 0, speed = 1, minBrightness = 30 } = options;
  
  const rgb = typeof color === 'string' ? hexToRgb(color) : color;
  const [h, s] = rgbToHsl(...rgb);
  
  // Calculate brightness based on frame
  const brightness = minBrightness + (Math.sin(frame * speed * 0.1) + 1) * ((100 - minBrightness) / 2);
  const [r, g, b] = hslToRgb(h, s, brightness);
  
  return `${ESC}38;2;${r};${g};${b}m${text}${CLOSE_FG}`;
};

/**
 * Sparkle effect (random bright characters)
 */
export const sparkle = (
  text: string,
  color: string | RgbColor = '#FFFFFF',
  options: { density?: number; seed?: number } = {}
): string => {
  const level = detectColorLevel();
  if (level < 3) return text;
  
  const { density = 0.3, seed = Date.now() } = options;
  
  const baseRgb = typeof color === 'string' ? hexToRgb(color) : color;
  const [h, s, l] = rgbToHsl(...baseRgb);
  
  const chars = [...text];
  let result = '';
  
  // Simple seeded random
  let random = seed;
  const nextRandom = () => {
    random = (random * 1103515245 + 12345) & 0x7fffffff;
    return random / 0x7fffffff;
  };
  
  for (const char of chars) {
    if (char === ' ' || char === '\n' || char === '\t') {
      result += char;
      continue;
    }
    
    if (nextRandom() < density) {
      // Sparkle (brighter)
      const sparkleRgb = hslToRgb(h, s, Math.min(100, l + 40));
      result += `${ESC}1m${ESC}38;2;${sparkleRgb[0]};${sparkleRgb[1]};${sparkleRgb[2]}m${char}${ESC}22m`;
    } else {
      // Normal
      result += `${ESC}38;2;${baseRgb[0]};${baseRgb[1]};${baseRgb[2]}m${char}`;
    }
  }
  
  return result + CLOSE_FG;
};

/**
 * Pride flag colors
 */
export const pride = (text: string, options: { preserveSpaces?: boolean } = {}): string => {
  const colors = [
    [228, 3, 3],     // Red
    [255, 140, 0],   // Orange
    [255, 237, 0],   // Yellow
    [0, 128, 38],    // Green
    [0, 77, 255],    // Blue
    [117, 7, 135],   // Purple
  ] as RgbColor[];
  
  return applyColorSequence(text, colors, options);
};

/**
 * Trans flag colors
 */
export const trans = (text: string, options: { preserveSpaces?: boolean } = {}): string => {
  const colors = [
    [91, 206, 250],  // Light blue
    [245, 169, 184], // Pink
    [255, 255, 255], // White
    [245, 169, 184], // Pink
    [91, 206, 250],  // Light blue
  ] as RgbColor[];
  
  return applyColorSequence(text, colors, options);
};

/**
 * Apply a sequence of colors to text
 */
const applyColorSequence = (
  text: string,
  colors: RgbColor[],
  options: { preserveSpaces?: boolean } = {}
): string => {
  const level = detectColorLevel();
  if (level < 3) return text;
  
  const { preserveSpaces = true } = options;
  
  const chars = [...text];
  const nonSpaceChars = chars.filter(c => c !== ' ' && c !== '\n' && c !== '\t');
  const charsPerColor = Math.ceil(nonSpaceChars.length / colors.length);
  
  let result = '';
  let charCount = 0;
  
  for (const char of chars) {
    if (preserveSpaces && (char === ' ' || char === '\n' || char === '\t')) {
      result += char;
      continue;
    }
    
    const color = colors[Math.min(Math.floor(charCount / charsPerColor), colors.length - 1)];
    result += `${ESC}38;2;${color[0]};${color[1]};${color[2]}m${char}`;
    charCount++;
  }
  
  return result + CLOSE_FG;
};

/**
 * Create custom rainbow function with preset options
 */
export const createRainbow = (defaultOptions: RainbowOptions) => {
  return (text: string, options?: RainbowOptions) => 
    rainbow(text, { ...defaultOptions, ...options });
};