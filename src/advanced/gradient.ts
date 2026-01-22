/**
 * BLITZ - Gradient Text
 * Create beautiful color gradients in the terminal
 */

import { ESC, CLOSE_FG } from '../core/ansi';
import { hexToRgb, interpolateRgb, interpolateHsl } from '../core/colors';
import { detectColorLevel } from '../core/detect';
import type { RgbColor, GradientOptions } from '../types';

/**
 * Apply gradient colors to text
 */
export const gradient = (
  text: string,
  colors: (string | RgbColor)[],
  options: GradientOptions = {}
): string => {
  const level = detectColorLevel();
  if (level < 3) {
    // Fallback for limited color support
    return text;
  }
  
  const {
    interpolation = 'rgb',
  } = options;
  
  // Parse colors
  const rgbColors: RgbColor[] = colors.map(c =>
    typeof c === 'string' ? hexToRgb(c) : c
  );
  
  if (rgbColors.length < 2) {
    return text;
  }
  
  const chars = [...text];
  const len = chars.length;
  
  if (len === 0) return '';
  
  const interpolate = interpolation === 'hsl' ? interpolateHsl : interpolateRgb;
  const segments = rgbColors.length - 1;
  
  let result = '';
  
  for (let i = 0; i < len; i++) {
    const char = chars[i];
    
    // Skip whitespace
    if (char === ' ' || char === '\n' || char === '\t') {
      result += char;
      continue;
    }
    
    // Calculate position in gradient (0 to 1)
    const t = len > 1 ? i / (len - 1) : 0;
    
    // Find which segment we're in
    const segmentPos = t * segments;
    const segmentIndex = Math.min(Math.floor(segmentPos), segments - 1);
    const segmentT = segmentPos - segmentIndex;
    
    // Interpolate color
    const color = interpolate(
      rgbColors[segmentIndex],
      rgbColors[segmentIndex + 1],
      segmentT
    );
    
    result += `${ESC}38;2;${color[0]};${color[1]};${color[2]}m${char}`;
  }
  
  return result + CLOSE_FG;
};

/**
 * Predefined gradient presets
 */
export const gradients = {
  rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
  sunset: ['#FF512F', '#F09819'],
  ocean: ['#2193b0', '#6dd5ed'],
  passion: ['#e53935', '#e35d5b'],
  vice: ['#5433FF', '#20BDFF', '#A5FECB'],
  cristal: ['#BDFFF3', '#4AC29A'],
  morning: ['#FF5F6D', '#FFC371'],
  forest: ['#134E5E', '#71B280'],
  instagram: ['#833ab4', '#fd1d1d', '#fcb045'],
  retro: ['#3f51b1', '#5a55ae', '#7b5fac', '#8f6aae', '#a86aa4', '#cc6b8e', '#f18271'],
  neon: ['#00ff87', '#60efff'],
  fire: ['#f12711', '#f5af19'],
  mind: ['#473B7B', '#3584A7', '#30D2BE'],
  fruit: ['#ff9a9e', '#fecfef'],
  teen: ['#77A1D3', '#79CBCA', '#E684AE'],
  atlas: ['#FEAC5E', '#C779D0', '#4BC0C8'],
  summer: ['#22c1c3', '#fdbb2d'],
  candy: ['#D3959B', '#BFE6BA'],
  cool: ['#0093E9', '#80D0C7'],
};

/**
 * Apply rainbow gradient
 */
export const rainbow = (text: string, options?: Omit<GradientOptions, 'colors'>): string => {
  return gradient(text, gradients.rainbow, options);
};

/**
 * Apply gradient to multiline text
 */
export const multilineGradient = (
  text: string,
  colors: (string | RgbColor)[],
  options: GradientOptions = {}
): string => {
  const lines = text.split('\n');
  const { direction = 'horizontal' } = options;
  
  if (direction === 'vertical') {
    // Apply gradient across lines
    const rgbColors: RgbColor[] = colors.map(c =>
      typeof c === 'string' ? hexToRgb(c) : c
    );
    
    const segments = rgbColors.length - 1;
    const interpolate = options.interpolation === 'hsl' ? interpolateHsl : interpolateRgb;
    
    return lines.map((line, i) => {
      const t = lines.length > 1 ? i / (lines.length - 1) : 0;
      const segmentPos = t * segments;
      const segmentIndex = Math.min(Math.floor(segmentPos), segments - 1);
      const segmentT = segmentPos - segmentIndex;
      
      const color = interpolate(
        rgbColors[segmentIndex],
        rgbColors[segmentIndex + 1],
        segmentT
      );
      
      return `${ESC}38;2;${color[0]};${color[1]};${color[2]}m${line}${CLOSE_FG}`;
    }).join('\n');
  }
  
  // Apply horizontal gradient to each line
  return lines.map(line => gradient(line, colors, options)).join('\n');
};

/**
 * Create gradient function with preset colors
 */
export const createGradient = (colors: (string | RgbColor)[], defaultOptions?: GradientOptions) => {
  return (text: string, options?: GradientOptions) => 
    gradient(text, colors, { ...defaultOptions, ...options });
};