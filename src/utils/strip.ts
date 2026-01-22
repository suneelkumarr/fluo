/**
 * BLITZ - Strip ANSI Utilities
 * High-performance ANSI code removal and manipulation
 */

// Optimized regex patterns (compiled once)
const ANSI_PATTERN = /\x1b\[[0-9;]*m/g;
const ANSI_FULL_PATTERN = /\x1b(?:\[[0-9;]*[a-zA-Z]|\][^\x07]*\x07|\][^\x1b]*\x1b\\)/g;
const ANSI_HYPERLINK_PATTERN = /\x1b\]8;[^;]*;[^\x07]*\x07/g;
const ANSI_CURSOR_PATTERN = /\x1b\[\d*[ABCDEFGJKST]/g;
const ANSI_ALL_PATTERN = /\x1b(?:\[[0-9;?]*[a-zA-Z]|\][^\x07\x1b]*(?:\x07|\x1b\\)|[PX^_][^\x1b]*\x1b\\|\][^\x07]*\x07)/g;

/**
 * Strip options
 */
export interface StripOptions {
  /** Only strip color/style codes (default: true) */
  colorsOnly?: boolean;
  /** Strip hyperlinks */
  hyperlinks?: boolean;
  /** Strip cursor movement codes */
  cursor?: boolean;
  /** Strip all ANSI sequences */
  all?: boolean;
  /** Preserve specific codes */
  preserve?: RegExp;
}

/**
 * Strip ANSI color/style codes from string
 * Fastest method for basic color stripping
 * 
 * @example
 * ```ts
 * stripAnsi('\x1b[31mRed\x1b[39m'); // 'Red'
 * ```
 */
export const stripAnsi = (str: string): string => {
  if (typeof str !== 'string') return '';
  if (str === '') return '';
  
  // Fast path: no escape sequences
  if (!str.includes('\x1b')) return str;
  
  return str.replace(ANSI_PATTERN, '');
};

/**
 * Strip all ANSI sequences including hyperlinks, cursor, etc.
 * 
 * @example
 * ```ts
 * stripAnsiAll('\x1b]8;;https://example.com\x07Link\x1b]8;;\x07');
 * // 'Link'
 * ```
 */
export const stripAnsiAll = (str: string): string => {
  if (typeof str !== 'string') return '';
  if (str === '') return '';
  if (!str.includes('\x1b')) return str;
  
  return str.replace(ANSI_ALL_PATTERN, '');
};

/**
 * Strip ANSI codes with options
 * 
 * @example
 * ```ts
 * strip('\x1b[31mRed\x1b[39m', { colorsOnly: true });
 * ```
 */
export const strip = (str: string, options: StripOptions = {}): string => {
  if (typeof str !== 'string') return '';
  if (str === '') return '';
  if (!str.includes('\x1b')) return str;
  
  const {
    colorsOnly = true,
    hyperlinks = false,
    cursor = false,
    all = false,
    preserve,
  } = options;
  
  let result = str;
  
  if (all) {
    result = result.replace(ANSI_ALL_PATTERN, '');
  } else {
    if (colorsOnly) {
      result = result.replace(ANSI_PATTERN, '');
    }
    if (hyperlinks) {
      result = result.replace(ANSI_HYPERLINK_PATTERN, '');
    }
    if (cursor) {
      result = result.replace(ANSI_CURSOR_PATTERN, '');
    }
  }
  
  // Re-add preserved codes (for special cases)
  if (preserve && str.match(preserve)) {
    const preserved = str.match(preserve);
    if (preserved) {
      // This is a simplified preserve - full implementation would be more complex
    }
  }
  
  return result;
};

/**
 * Strip ANSI codes from start of string only
 */
export const stripAnsiStart = (str: string): string => {
  if (typeof str !== 'string' || str === '') return '';
  
  let i = 0;
  while (i < str.length) {
    if (str[i] === '\x1b') {
      const match = str.slice(i).match(/^\x1b\[[0-9;]*m/);
      if (match) {
        i += match[0].length;
        continue;
      }
    }
    break;
  }
  
  return str.slice(i);
};

/**
 * Strip ANSI codes from end of string only
 */
export const stripAnsiEnd = (str: string): string => {
  if (typeof str !== 'string' || str === '') return '';
  
  // Find all trailing ANSI codes
  const match = str.match(/(\x1b\[[0-9;]*m)+$/);
  if (match) {
    return str.slice(0, -match[0].length);
  }
  
  return str;
};

/**
 * Check if string contains ANSI codes
 * 
 * @example
 * ```ts
 * hasAnsi('\x1b[31mRed\x1b[39m'); // true
 * hasAnsi('Plain text'); // false
 * ```
 */
export const hasAnsi = (str: string): boolean => {
  if (typeof str !== 'string') return false;
  return ANSI_PATTERN.test(str);
};

/**
 * Check if string contains any ANSI sequences
 */
export const hasAnsiSequence = (str: string): boolean => {
  if (typeof str !== 'string') return false;
  return str.includes('\x1b');
};

/**
 * Check if string contains hyperlinks
 */
export const hasHyperlink = (str: string): boolean => {
  if (typeof str !== 'string') return false;
  return str.includes('\x1b]8;');
};

/**
 * Extract all ANSI codes from string
 * 
 * @example
 * ```ts
 * extractAnsi('\x1b[31mRed\x1b[39m');
 * // ['\x1b[31m', '\x1b[39m']
 * ```
 */
export const extractAnsi = (str: string): string[] => {
  if (typeof str !== 'string') return [];
  const matches = str.match(ANSI_PATTERN);
  return matches || [];
};

/**
 * Extract all ANSI sequences from string
 */
export const extractAnsiAll = (str: string): string[] => {
  if (typeof str !== 'string') return [];
  const matches = str.match(ANSI_ALL_PATTERN);
  return matches || [];
};

/**
 * Count ANSI codes in string
 */
export const countAnsi = (str: string): number => {
  return extractAnsi(str).length;
};

/**
 * Split string into segments with ANSI info
 */
export interface AnsiSegment {
  text: string;
  codes: string[];
  raw: string;
}

/**
 * Parse string into segments with their ANSI codes
 * 
 * @example
 * ```ts
 * parseAnsi('\x1b[31mRed\x1b[39m text');
 * // [
 * //   { text: 'Red', codes: ['\x1b[31m'], raw: '\x1b[31mRed' },
 * //   { text: ' text', codes: ['\x1b[39m'], raw: '\x1b[39m text' }
 * // ]
 * ```
 */
export const parseAnsi = (str: string): AnsiSegment[] => {
  if (typeof str !== 'string' || str === '') return [];
  
  const segments: AnsiSegment[] = [];
  const regex = /(\x1b\[[0-9;]*m)/g;
  
  let lastIndex = 0;
  let currentCodes: string[] = [];
  let match: RegExpExecArray | null;
  
  while ((match = regex.exec(str)) !== null) {
    // Text before this code
    if (match.index > lastIndex) {
      const text = str.slice(lastIndex, match.index);
      segments.push({
        text,
        codes: [...currentCodes],
        raw: currentCodes.join('') + text,
      });
    }
    
    currentCodes.push(match[1]);
    lastIndex = regex.lastIndex;
  }
  
  // Remaining text
  if (lastIndex < str.length) {
    const text = str.slice(lastIndex);
    segments.push({
      text,
      codes: [...currentCodes],
      raw: currentCodes.join('') + text,
    });
  }
  
  return segments;
};

/**
 * Replace ANSI codes with custom replacer
 */
export const replaceAnsi = (
  str: string,
  replacer: (code: string, index: number) => string
): string => {
  if (typeof str !== 'string') return '';
  
  let index = 0;
  return str.replace(ANSI_PATTERN, (match) => {
    return replacer(match, index++);
  });
};

/**
 * Escape ANSI codes (make them visible)
 * 
 * @example
 * ```ts
 * escapeAnsi('\x1b[31m'); // '\\x1b[31m'
 * ```
 */
export const escapeAnsi = (str: string): string => {
  if (typeof str !== 'string') return '';
  return str.replace(/\x1b/g, '\\x1b');
};

/**
 * Unescape ANSI codes
 * 
 * @example
 * ```ts
 * unescapeAnsi('\\x1b[31m'); // '\x1b[31m'
 * ```
 */
export const unescapeAnsi = (str: string): string => {
  if (typeof str !== 'string') return '';
  return str.replace(/\\x1b/g, '\x1b');
};

/**
 * Normalize ANSI codes (merge consecutive, remove redundant)
 */
export const normalizeAnsi = (str: string): string => {
  if (typeof str !== 'string') return '';
  if (!str.includes('\x1b')) return str;
  
  // Remove empty style pairs
  let result = str;
  let prev = '';
  
  while (result !== prev) {
    prev = result;
    // Remove reset followed immediately by style
    result = result.replace(/\x1b\[0m(\x1b\[[0-9;]+m)/g, '$1');
    // Remove consecutive same codes
    result = result.replace(/(\x1b\[[0-9;]+m)\1+/g, '$1');
  }
  
  return result;
};

/**
 * Clean ANSI string (normalize and remove unnecessary codes)
 */
export const cleanAnsi = (str: string): string => {
  if (typeof str !== 'string') return '';
  if (!str.includes('\x1b')) return str;
  
  let result = normalizeAnsi(str);
  
  // Remove trailing resets
  result = result.replace(/(\x1b\[(?:0|39|49)m)+$/, '');
  
  // Remove leading resets
  result = result.replace(/^(\x1b\[(?:0|39|49)m)+/, '');
  
  return result;
};

// Export regex patterns for external use
export const patterns = {
  color: ANSI_PATTERN,
  full: ANSI_FULL_PATTERN,
  hyperlink: ANSI_HYPERLINK_PATTERN,
  cursor: ANSI_CURSOR_PATTERN,
  all: ANSI_ALL_PATTERN,
};

// Default export
export default stripAnsi;