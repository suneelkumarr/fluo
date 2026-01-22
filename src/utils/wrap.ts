/**
 * BLITZ - Word Wrap Utilities
 * ANSI-aware text wrapping for terminal output
 */

import { stripAnsi } from './strip';
import { visibleLength, visibleSlice } from './visible';

/**
 * Wrap options
 */
export interface WrapOptions {
  /** Maximum width (default: 80) */
  width?: number;
  /** Hard wrap (break words) */
  hard?: boolean;
  /** Trim whitespace from lines */
  trim?: boolean;
  /** Preserve existing newlines */
  preserveNewlines?: boolean;
  /** Word break characters */
  wordBreak?: string;
  /** Indent continuation lines */
  indent?: string;
  /** Cut long words */
  cut?: boolean;
  /** Preserve ANSI codes across lines */
  preserveAnsi?: boolean;
}

/**
 * Word wrap result
 */
export interface WrapResult {
  /** Wrapped lines */
  lines: string[];
  /** Total line count */
  count: number;
  /** Joined result with newlines */
  text: string;
}

/**
 * Track active ANSI codes for line continuation
 */
interface AnsiState {
  fg: string;
  bg: string;
  modifiers: string[];
}

/**
 * Parse and track ANSI state
 */
const parseAnsiState = (codes: string[]): AnsiState => {
  const state: AnsiState = { fg: '', bg: '', modifiers: [] };
  
  for (const code of codes) {
    const match = code.match(/\x1b\[([0-9;]+)m/);
    if (!match) continue;
    
    const parts = match[1].split(';').map(Number);
    
    for (const num of parts) {
      if (num === 0) {
        // Reset
        state.fg = '';
        state.bg = '';
        state.modifiers = [];
      } else if (num >= 30 && num <= 37) {
        state.fg = code;
      } else if (num >= 40 && num <= 47) {
        state.bg = code;
      } else if (num >= 90 && num <= 97) {
        state.fg = code;
      } else if (num >= 100 && num <= 107) {
        state.bg = code;
      } else if (num === 38 || num === 48) {
        // Extended color - take the whole code
        if (num === 38) state.fg = code;
        else state.bg = code;
      } else if (num >= 1 && num <= 9) {
        state.modifiers.push(code);
      }
    }
  }
  
  return state;
};

/**
 * Get ANSI state string
 */
const getAnsiStateString = (state: AnsiState): string => {
  const parts: string[] = [];
  if (state.modifiers.length) parts.push(...state.modifiers);
  if (state.fg) parts.push(state.fg);
  if (state.bg) parts.push(state.bg);
  return parts.join('');
};

/**
 * Word wrap text with ANSI support
 * 
 * @example
 * ```ts
 * wrap('Hello World', { width: 5 });
 * // 'Hello\nWorld'
 * 
 * wrap('\x1b[31mRed text here\x1b[39m', { width: 8 });
 * // '\x1b[31mRed text\x1b[39m\n\x1b[31mhere\x1b[39m'
 * ```
 */
export const wrap = (str: string, options: WrapOptions = {}): string => {
  const result = wrapLines(str, options);
  return result.text;
};

/**
 * Word wrap text and return structured result
 */
export const wrapLines = (str: string, options: WrapOptions = {}): WrapResult => {
  const {
    width = 80,
    hard = false,
    trim = true,
    preserveNewlines = true,
    wordBreak = ' \t-',
    indent = '',
    cut = false,
    preserveAnsi = true,
  } = options;
  
  if (typeof str !== 'string') {
    return { lines: [], count: 0, text: '' };
  }
  
  if (str === '') {
    return { lines: [''], count: 1, text: '' };
  }
  
  const lines: string[] = [];
  const inputLines = preserveNewlines ? str.split('\n') : [str.replace(/\n/g, ' ')];
  
  // Track ANSI state for continuation
  let ansiState: AnsiState = { fg: '', bg: '', modifiers: [] };
  const ansiCodes: string[] = [];
  
  for (let lineIndex = 0; lineIndex < inputLines.length; lineIndex++) {
    let line = inputLines[lineIndex];
    
    if (trim) {
      line = line.trim();
    }
    
    // Handle empty lines
    if (line === '' || visibleLength(line) === 0) {
      lines.push(preserveAnsi ? getAnsiStateString(ansiState) : '');
      continue;
    }
    
    // Check if line needs wrapping
    if (visibleLength(line) <= width) {
      // Update ANSI state
      if (preserveAnsi) {
        const codes = line.match(/\x1b\[[0-9;]+m/g) || [];
        ansiCodes.push(...codes);
        ansiState = parseAnsiState(ansiCodes);
      }
      lines.push(line);
      continue;
    }
    
    // Need to wrap this line
    let remaining = line;
    let isFirstPart = true;
    
    while (visibleLength(remaining) > 0) {
      const effectiveWidth = isFirstPart ? width : width - visibleLength(indent);
      const prefix = isFirstPart ? '' : indent;
      
      if (visibleLength(remaining) <= effectiveWidth) {
        // Last segment
        if (preserveAnsi) {
          const codes = remaining.match(/\x1b\[[0-9;]+m/g) || [];
          ansiCodes.push(...codes);
          ansiState = parseAnsiState(ansiCodes);
        }
        lines.push(prefix + remaining);
        break;
      }
      
      // Find break point
      let breakPoint = effectiveWidth;
      const stripped = stripAnsi(remaining);
      
      if (!hard && !cut) {
        // Find last word break character before width
        let lastBreak = -1;
        let visiblePos = 0;
        let actualPos = 0;
        
        for (let i = 0; i < remaining.length; i++) {
          if (remaining[i] === '\x1b') {
            // Skip ANSI sequence
            const match = remaining.slice(i).match(/^\x1b\[[0-9;]*m/);
            if (match) {
              actualPos += match[0].length;
              i += match[0].length - 1;
              continue;
            }
          }
          
          if (wordBreak.includes(remaining[i]) && visiblePos <= effectiveWidth) {
            lastBreak = actualPos + 1;
          }
          
          visiblePos++;
          actualPos++;
          
          if (visiblePos > effectiveWidth && lastBreak > 0) {
            break;
          }
        }
        
        if (lastBreak > 0 && lastBreak < remaining.length) {
          breakPoint = lastBreak;
        } else {
          // No break found, force break at width
          breakPoint = effectiveWidth;
        }
      }
      
      // Get segment with ANSI preservation
      let segment: string;
      let rest: string;
      
      if (preserveAnsi) {
        segment = visibleSlice(remaining, 0, breakPoint);
        rest = visibleSlice(remaining, breakPoint);
        
        // Track ANSI codes
        const codes = segment.match(/\x1b\[[0-9;]+m/g) || [];
        ansiCodes.push(...codes);
        ansiState = parseAnsiState(ansiCodes);
        
        // Add reset at end of segment
        if (segment && !segment.endsWith('\x1b[0m') && !segment.endsWith('\x1b[39m')) {
          segment += '\x1b[0m';
        }
        
        // Add state prefix to continuation
        const statePrefix = getAnsiStateString(ansiState);
        rest = statePrefix + rest.trimStart();
      } else {
        segment = stripAnsi(remaining).slice(0, breakPoint);
        rest = stripAnsi(remaining).slice(breakPoint);
      }
      
      if (trim) {
        segment = segment.trimEnd();
        rest = rest.trimStart();
      }
      
      lines.push(prefix + segment);
      remaining = rest;
      isFirstPart = false;
    }
  }
  
  return {
    lines,
    count: lines.length,
    text: lines.join('\n'),
  };
};

/**
 * Wrap text to fit terminal width
 */
export const wrapToTerminal = (str: string, options: Omit<WrapOptions, 'width'> = {}): string => {
  const termWidth = typeof process !== 'undefined' && process.stdout?.columns
    ? process.stdout.columns
    : 80;
  
  return wrap(str, { ...options, width: termWidth });
};

/**
 * Wrap and indent text (useful for help text, descriptions)
 */
export const wrapIndent = (
  str: string,
  firstIndent: string,
  restIndent: string,
  options: Omit<WrapOptions, 'indent'> = {}
): string => {
  const width = options.width || 80;
  const firstWidth = width - visibleLength(firstIndent);
  const restWidth = width - visibleLength(restIndent);
  
  const lines = wrapLines(str, { ...options, width: firstWidth }).lines;
  
  if (lines.length === 0) return firstIndent;
  
  const result = [firstIndent + lines[0]];
  
  for (let i = 1; i < lines.length; i++) {
    // Re-wrap if rest indent is different
    const rewrapped = wrapLines(lines[i], { ...options, width: restWidth }).lines;
    for (const line of rewrapped) {
      result.push(restIndent + line);
    }
  }
  
  return result.join('\n');
};

/**
 * Wrap text in columns
 */
export interface ColumnOptions {
  /** Column widths */
  widths: number[];
  /** Column separator */
  separator?: string;
  /** Padding character */
  padding?: string;
  /** Align columns */
  align?: ('left' | 'center' | 'right')[];
}

/**
 * Format text in columns
 * 
 * @example
 * ```ts
 * columns(['Name', 'Description'], {
 *   widths: [20, 40],
 *   separator: ' | '
 * });
 * ```
 */
export const columns = (texts: string[], options: ColumnOptions): string => {
  const {
    widths,
    separator = '  ',
    padding = ' ',
    align = [],
  } = options;
  
  // Wrap each column
  const wrappedColumns: string[][] = texts.map((text, i) => {
    const width = widths[i] || 20;
    return wrapLines(String(text), { width }).lines;
  });
  
  // Find max lines
  const maxLines = Math.max(...wrappedColumns.map(col => col.length));
  
  // Build output
  const outputLines: string[] = [];
  
  for (let lineNum = 0; lineNum < maxLines; lineNum++) {
    const parts: string[] = [];
    
    for (let colNum = 0; colNum < widths.length; colNum++) {
      const width = widths[colNum];
      const colAlign = align[colNum] || 'left';
      const text = wrappedColumns[colNum]?.[lineNum] || '';
      const visLen = visibleLength(text);
      const padLen = Math.max(0, width - visLen);
      
      let padded: string;
      switch (colAlign) {
        case 'right':
          padded = padding.repeat(padLen) + text;
          break;
        case 'center':
          const left = Math.floor(padLen / 2);
          const right = padLen - left;
          padded = padding.repeat(left) + text + padding.repeat(right);
          break;
        default:
          padded = text + padding.repeat(padLen);
      }
      
      parts.push(padded);
    }
    
    outputLines.push(parts.join(separator));
  }
  
  return outputLines.join('\n');
};

/**
 * Create a text block with consistent width
 */
export const block = (
  str: string,
  width: number,
  options: { align?: 'left' | 'center' | 'right'; pad?: string } = {}
): string => {
  const { align = 'left', pad = ' ' } = options;
  const lines = wrapLines(str, { width }).lines;
  
  return lines.map(line => {
    const visLen = visibleLength(line);
    const padLen = Math.max(0, width - visLen);
    
    switch (align) {
      case 'right':
        return pad.repeat(padLen) + line;
      case 'center':
        const left = Math.floor(padLen / 2);
        const right = padLen - left;
        return pad.repeat(left) + line + pad.repeat(right);
      default:
        return line + pad.repeat(padLen);
    }
  }).join('\n');
};

/**
 * Dedent text (remove common leading whitespace)
 */
export const dedent = (str: string): string => {
  const lines = str.split('\n');
  
  // Find minimum indent (ignoring empty lines)
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim() === '') continue;
    const indent = line.match(/^(\s*)/)?.[1].length || 0;
    minIndent = Math.min(minIndent, indent);
  }
  
  if (minIndent === 0 || minIndent === Infinity) return str;
  
  return lines.map(line => line.slice(minIndent)).join('\n');
};

/**
 * Indent text
 */
export const indent = (str: string, prefix: string = '  '): string => {
  return str.split('\n').map(line => prefix + line).join('\n');
};

// Default export
export default wrap;