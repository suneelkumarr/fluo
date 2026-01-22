/**
 * BLITZ - Visible String Utilities
 * Calculate visible length and manipulate strings with ANSI awareness
 */

import { stripAnsi, extractAnsi } from './strip';

/**
 * Visible length options
 */
export interface VisibleOptions {
  /** Count wide characters (CJK, emoji) as 2 */
  wide?: boolean;
  /** Include ANSI codes in length (default: false) */
  countAnsi?: boolean;
}

/**
 * Character width cache for performance
 */
const widthCache = new Map<number, number>();
const MAX_CACHE_SIZE = 10000;

/**
 * Get character width (for wide character support)
 */
const getCharWidth = (codePoint: number): number => {
  const cached = widthCache.get(codePoint);
  if (cached !== undefined) return cached;
  
  let width: number;
  
  // Control characters
  if (codePoint < 32 || (codePoint >= 0x7f && codePoint < 0xa0)) {
    width = 0;
  }
  // CJK characters
  else if (
    (codePoint >= 0x1100 && codePoint <= 0x115f) || // Hangul Jamo
    (codePoint >= 0x2e80 && codePoint <= 0xa4cf) || // CJK
    (codePoint >= 0xac00 && codePoint <= 0xd7a3) || // Hangul Syllables
    (codePoint >= 0xf900 && codePoint <= 0xfaff) || // CJK Compatibility
    (codePoint >= 0xfe10 && codePoint <= 0xfe6f) || // CJK Forms
    (codePoint >= 0xff00 && codePoint <= 0xff60) || // Fullwidth Forms
    (codePoint >= 0xffe0 && codePoint <= 0xffe6) || // Fullwidth Forms
    (codePoint >= 0x20000 && codePoint <= 0x2fffd) || // CJK Extension
    (codePoint >= 0x30000 && codePoint <= 0x3fffd)    // CJK Extension
  ) {
    width = 2;
  }
  // Emoji (simplified detection)
  else if (
    (codePoint >= 0x1f300 && codePoint <= 0x1f9ff) || // Emoji
    (codePoint >= 0x2600 && codePoint <= 0x26ff) ||   // Misc symbols
    (codePoint >= 0x2700 && codePoint <= 0x27bf)      // Dingbats
  ) {
    width = 2;
  }
  // Default
  else {
    width = 1;
  }
  
  // Cache with size limit
  if (widthCache.size >= MAX_CACHE_SIZE) {
    const firstKey = widthCache.keys().next().value;
    if (firstKey !== undefined) widthCache.delete(firstKey);
  }
  widthCache.set(codePoint, width);
  
  return width;
};

/**
 * Get visible length of string (without ANSI codes)
 * 
 * @example
 * ```ts
 * visibleLength('\x1b[31mHello\x1b[39m'); // 5
 * visibleLength('Hello'); // 5
 * ```
 */
export const visibleLength = (str: string, options: VisibleOptions = {}): number => {
  if (typeof str !== 'string') return 0;
  if (str === '') return 0;
  
  const { wide = false, countAnsi = false } = options;
  
  const text = countAnsi ? str : stripAnsi(str);
  
  if (!wide) {
    return [...text].length;
  }
  
  // Calculate width with wide character support
  let width = 0;
  for (const char of text) {
    width += getCharWidth(char.codePointAt(0) || 0);
  }
  
  return width;
};

/**
 * Alias for visibleLength
 */
export const stringWidth = visibleLength;

/**
 * Get visible slice of string (preserves ANSI codes)
 * 
 * @example
 * ```ts
 * visibleSlice('\x1b[31mHello World\x1b[39m', 0, 5);
 * // '\x1b[31mHello\x1b[39m'
 * ```
 */
export const visibleSlice = (
  str: string,
  start: number,
  end?: number
): string => {
  if (typeof str !== 'string') return '';
  if (str === '') return '';
  
  // Fast path: no ANSI codes
  if (!str.includes('\x1b')) {
    return [...str].slice(start, end).join('');
  }
  
  const chars = [...str];
  const endIdx = end ?? chars.length;
  
  let result = '';
  let visibleIdx = 0;
  let i = 0;
  let openCodes: string[] = [];
  
  while (i < chars.length) {
    // Check for ANSI sequence start
    if (chars[i] === '\x1b') {
      // Find the full sequence
      let seq = chars[i];
      i++;
      
      while (i < chars.length && chars[i] !== 'm') {
        seq += chars[i];
        i++;
      }
      
      if (i < chars.length) {
        seq += chars[i]; // Include 'm'
        i++;
      }
      
      // Track codes for proper slicing
      if (visibleIdx >= start && visibleIdx < endIdx) {
        result += seq;
      } else if (visibleIdx < start) {
        // Track open codes for later
        if (seq.includes('[0m')) {
          openCodes = [];
        } else {
          openCodes.push(seq);
        }
      }
      
      continue;
    }
    
    // Regular character
    if (visibleIdx >= start && visibleIdx < endIdx) {
      // Add open codes at start
      if (visibleIdx === start && openCodes.length > 0) {
        result = openCodes.join('') + result;
      }
      result += chars[i];
    }
    
    visibleIdx++;
    i++;
    
    // Early exit if we've passed end
    if (end !== undefined && visibleIdx >= endIdx) {
      // Find any remaining ANSI codes that should close
      while (i < chars.length) {
        if (chars[i] === '\x1b') {
          let seq = chars[i];
          i++;
          while (i < chars.length && chars[i] !== 'm') {
            seq += chars[i];
            i++;
          }
          if (i < chars.length) {
            seq += chars[i];
            i++;
          }
          
          // Add closing codes
          if (seq.includes('[0m') || seq.includes('[39m') || seq.includes('[49m')) {
            result += seq;
            break;
          }
        } else {
          break;
        }
      }
      break;
    }
  }
  
  return result;
};

/**
 * Truncate string to visible length with ellipsis
 * 
 * @example
 * ```ts
 * visibleTruncate('Hello World', 8); // 'Hello W…'
 * visibleTruncate('\x1b[31mHello World\x1b[39m', 8);
 * // '\x1b[31mHello W…\x1b[39m'
 * ```
 */
export const visibleTruncate = (
  str: string,
  maxLength: number,
  options: { ellipsis?: string; position?: 'end' | 'middle' | 'start' } = {}
): string => {
  if (typeof str !== 'string') return '';
  
  const { ellipsis = '…', position = 'end' } = options;
  const visible = visibleLength(str);
  const ellipsisLen = visibleLength(ellipsis);
  
  if (visible <= maxLength) {
    return str;
  }
  
  if (maxLength <= ellipsisLen) {
    return ellipsis.slice(0, maxLength);
  }
  
  const targetLen = maxLength - ellipsisLen;
  
  switch (position) {
    case 'start':
      return ellipsis + visibleSlice(str, visible - targetLen);
    
    case 'middle':
      const leftLen = Math.ceil(targetLen / 2);
      const rightLen = Math.floor(targetLen / 2);
      return visibleSlice(str, 0, leftLen) + ellipsis + visibleSlice(str, visible - rightLen);
    
    default: // end
      return visibleSlice(str, 0, targetLen) + ellipsis;
  }
};

/**
 * Alias for visibleTruncate
 */
export const truncate = visibleTruncate;

/**
 * Pad string to visible length
 * 
 * @example
 * ```ts
 * visiblePadEnd('Hi', 5); // 'Hi   '
 * visiblePadStart('Hi', 5); // '   Hi'
 * visiblePadBoth('Hi', 6); // '  Hi  '
 * ```
 */
export const visiblePadEnd = (
  str: string,
  length: number,
  padStr: string = ' '
): string => {
  if (typeof str !== 'string') return padStr.repeat(length);
  
  const visible = visibleLength(str);
  if (visible >= length) return str;
  
  const padLen = length - visible;
  const fullPads = Math.floor(padLen / visibleLength(padStr));
  const remainPad = padLen % visibleLength(padStr);
  
  return str + padStr.repeat(fullPads) + padStr.slice(0, remainPad);
};

export const visiblePadStart = (
  str: string,
  length: number,
  padStr: string = ' '
): string => {
  if (typeof str !== 'string') return padStr.repeat(length);
  
  const visible = visibleLength(str);
  if (visible >= length) return str;
  
  const padLen = length - visible;
  const fullPads = Math.floor(padLen / visibleLength(padStr));
  const remainPad = padLen % visibleLength(padStr);
  
  return padStr.repeat(fullPads) + padStr.slice(0, remainPad) + str;
};

export const visiblePadBoth = (
  str: string,
  length: number,
  padStr: string = ' '
): string => {
  if (typeof str !== 'string') return padStr.repeat(length);
  
  const visible = visibleLength(str);
  if (visible >= length) return str;
  
  const padLen = length - visible;
  const leftPad = Math.floor(padLen / 2);
  const rightPad = padLen - leftPad;
  
  return visiblePadStart(visiblePadEnd(str, visible + rightPad, padStr), length, padStr);
};

/**
 * Center string in visible width
 */
export const visibleCenter = (str: string, width: number, padStr: string = ' '): string => {
  return visiblePadBoth(str, width, padStr);
};

/**
 * Align string to visible width
 */
export const visibleAlign = (
  str: string,
  width: number,
  align: 'left' | 'center' | 'right' = 'left',
  padStr: string = ' '
): string => {
  switch (align) {
    case 'right':
      return visiblePadStart(str, width, padStr);
    case 'center':
      return visiblePadBoth(str, width, padStr);
    default:
      return visiblePadEnd(str, width, padStr);
  }
};

/**
 * Split string at visible index
 */
export const visibleSplitAt = (str: string, index: number): [string, string] => {
  return [
    visibleSlice(str, 0, index),
    visibleSlice(str, index),
  ];
};

/**
 * Check if string fits within visible width
 */
export const visibleFits = (str: string, width: number, options?: VisibleOptions): boolean => {
  return visibleLength(str, options) <= width;
};

/**
 * Get visible character at index
 */
export const visibleCharAt = (str: string, index: number): string => {
  return visibleSlice(str, index, index + 1);
};

/**
 * Find visible index of substring
 */
export const visibleIndexOf = (str: string, search: string, fromIndex: number = 0): number => {
  const stripped = stripAnsi(str);
  const strippedSearch = stripAnsi(search);
  return stripped.indexOf(strippedSearch, fromIndex);
};

/**
 * Replace at visible position
 */
export const visibleReplace = (
  str: string,
  start: number,
  end: number,
  replacement: string
): string => {
  return visibleSlice(str, 0, start) + replacement + visibleSlice(str, end);
};

/**
 * Insert at visible position
 */
export const visibleInsert = (str: string, index: number, insert: string): string => {
  return visibleSlice(str, 0, index) + insert + visibleSlice(str, index);
};

/**
 * Get visible substring (alias for visibleSlice)
 */
export const visibleSubstring = visibleSlice;

/**
 * Count visible lines (accounting for wrapping)
 */
export const visibleLines = (str: string, width: number): number => {
  if (!str) return 0;
  
  let lines = 0;
  for (const line of str.split('\n')) {
    const len = visibleLength(line);
    lines += Math.max(1, Math.ceil(len / width));
  }
  
  return lines;
};

/**
 * Measure text dimensions
 */
export interface TextDimensions {
  width: number;
  height: number;
  maxLineWidth: number;
  lines: number;
}

export const measureText = (str: string, options?: VisibleOptions): TextDimensions => {
  if (!str) {
    return { width: 0, height: 0, maxLineWidth: 0, lines: 0 };
  }
  
  const lines = str.split('\n');
  const lineLengths = lines.map(line => visibleLength(line, options));
  const maxLineWidth = Math.max(...lineLengths);
  
  return {
    width: lineLengths.reduce((a, b) => a + b, 0),
    height: lines.length,
    maxLineWidth,
    lines: lines.length,
  };
};

// Default export
export default visibleLength;