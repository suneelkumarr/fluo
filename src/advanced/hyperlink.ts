/**
 * BLITZ - Terminal Hyperlinks
 * Create clickable links in supported terminals
 */

import { OSC, BEL, ESC } from '../core/ansi';
import { detectColorLevel } from '../core/detect';

/**
 * Hyperlink options
 */
export interface HyperlinkOptions {
  /** Link ID for grouping multiple link segments */
  id?: string;
  /** Additional parameters */
  params?: Record<string, string>;
  /** Fallback text when hyperlinks aren't supported */
  fallback?: 'url' | 'text' | 'both' | 'none';
  /** Style for the link text */
  style?: 'underline' | 'none';
}

/**
 * Check if terminal supports hyperlinks
 * Most modern terminals support OSC 8 hyperlinks
 */
export const supportsHyperlinks = (): boolean => {
  // Check common environment variables
  if (typeof process === 'undefined') return false;
  
  const env = process.env || {};
  
  // Force hyperlinks
  if (env.FORCE_HYPERLINK === '1') return true;
  if (env.FORCE_HYPERLINK === '0') return false;
  
  // Known unsupported terminals
  if (env.TERM_PROGRAM === 'Apple_Terminal') return false;
  
  // Known supported terminals
  const supported = [
    'iTerm.app',
    'WezTerm',
    'vscode',
    'Hyper',
    'Tabby',
    'Alacritty',
    'Kitty',
    'Rio',
    'Warp',
  ];
  
  const termProgram = env.TERM_PROGRAM || '';
  if (supported.some(t => termProgram.includes(t))) return true;
  
  // Check for VTE version (GNOME Terminal, etc.)
  const vteVersion = parseInt(env.VTE_VERSION || '0', 10);
  if (vteVersion >= 5000) return true;
  
  // Check COLORTERM for modern terminal indication
  if (env.COLORTERM === 'truecolor') return true;
  
  // Konsole
  if (env.KONSOLE_VERSION) return true;
  
  // Default: assume no support for safety
  return false;
};

/**
 * Create a hyperlink with OSC 8 sequence
 */
export const hyperlink = (url: string, text: string, options: HyperlinkOptions = {}): string => {
  const { id, params = {}, fallback = 'text', style = 'underline' } = options;
  
  // Check support
  if (!supportsHyperlinks()) {
    switch (fallback) {
      case 'url':
        return url;
      case 'both':
        return `${text} (${url})`;
      case 'none':
        return '';
      default:
        return text;
    }
  }
  
  // Build params string
  const paramParts: string[] = [];
  if (id) paramParts.push(`id=${id}`);
  for (const [key, value] of Object.entries(params)) {
    paramParts.push(`${key}=${value}`);
  }
  const paramStr = paramParts.length > 0 ? paramParts.join(':') : '';
  
  // OSC 8 ; params ; url BEL text OSC 8 ; ; BEL
  const start = `${OSC}8;${paramStr};${url}${BEL}`;
  const end = `${OSC}8;;${BEL}`;
  
  // Apply underline style if requested
  const styledText = style === 'underline' ? `${ESC}[4m${text}${ESC}[24m` : text;
  
  return `${start}${styledText}${end}`;
};

/**
 * Create an email link
 */
export const email = (address: string, text?: string, options: Omit<HyperlinkOptions, 'fallback'> = {}): string => {
  return hyperlink(`mailto:${address}`, text || address, options);
};

/**
 * Create a file link
 */
export const file = (path: string, text?: string, options: Omit<HyperlinkOptions, 'fallback'> = {}): string => {
  // Ensure proper file:// URL format
  let fileUrl: string;
  
  if (path.startsWith('file://')) {
    fileUrl = path;
  } else if (path.startsWith('/')) {
    fileUrl = `file://${path}`;
  } else {
    // Relative path - resolve from cwd
    const cwd = typeof process !== 'undefined' ? process.cwd() : '';
    fileUrl = `file://${cwd}/${path}`;
  }
  
  return hyperlink(fileUrl, text || path, options);
};

/**
 * Create a line-specific file link (for IDEs)
 */
export const fileLine = (
  path: string,
  line: number,
  column?: number,
  text?: string,
  options: Omit<HyperlinkOptions, 'fallback'> = {}
): string => {
  let fileUrl = path.startsWith('/') ? `file://${path}` : `file://${process.cwd()}/${path}`;
  
  // Add line/column info as fragment (VSCode/JetBrains format)
  if (column !== undefined) {
    fileUrl += `#${line}:${column}`;
  } else {
    fileUrl += `#${line}`;
  }
  
  const displayText = text || `${path}:${line}${column !== undefined ? `:${column}` : ''}`;
  
  return hyperlink(fileUrl, displayText, options);
};

/**
 * Create multiple links with same ID (for wrapping)
 */
export const linkGroup = (
  url: string,
  segments: string[],
  options: Omit<HyperlinkOptions, 'id'> = {}
): string[] => {
  const id = `link-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return segments.map(segment => hyperlink(url, segment, { ...options, id }));
};

/**
 * Auto-detect and linkify URLs in text
 */
export const autoLink = (text: string, options: HyperlinkOptions = {}): string => {
  if (!supportsHyperlinks()) return text;
  
  // URL regex pattern
  const urlPattern = /https?:\/\/[^\s<>'")\]]+/g;
  
  return text.replace(urlPattern, (url) => {
    // Clean up trailing punctuation that might be part of sentence
    const trailingPunct = url.match(/[.,;:!?]+$/);
    const cleanUrl = trailingPunct ? url.slice(0, -trailingPunct[0].length) : url;
    const suffix = trailingPunct ? trailingPunct[0] : '';
    
    return hyperlink(cleanUrl, cleanUrl, options) + suffix;
  });
};

/**
 * Create a link with icon prefix
 */
export const iconLink = (
  url: string,
  text: string,
  icon: string = '🔗',
  options: HyperlinkOptions = {}
): string => {
  return `${icon} ${hyperlink(url, text, options)}`;
};

/**
 * Link builder for complex link creation
 */
export class LinkBuilder {
  private _url: string = '';
  private _text: string = '';
  private _options: HyperlinkOptions = {};
  
  url(url: string): this {
    this._url = url;
    return this;
  }
  
  text(text: string): this {
    this._text = text;
    return this;
  }
  
  id(id: string): this {
    this._options.id = id;
    return this;
  }
  
  param(key: string, value: string): this {
    this._options.params = this._options.params || {};
    this._options.params[key] = value;
    return this;
  }
  
  fallback(mode: HyperlinkOptions['fallback']): this {
    this._options.fallback = mode;
    return this;
  }
  
  noUnderline(): this {
    this._options.style = 'none';
    return this;
  }
  
  build(): string {
    return hyperlink(this._url, this._text || this._url, this._options);
  }
}

/**
 * Create a new link builder
 */
export const link = (): LinkBuilder => new LinkBuilder();

/**
 * Create styled link (with color)
 */
export const styledLink = (
  url: string,
  text: string,
  color: string = '#60A5FA',
  options: HyperlinkOptions = {}
): string => {
  // Import dynamically to avoid circular deps
  const { hexToRgb } = require('../core/colors');
  const [r, g, b] = hexToRgb(color);
  
  const coloredText = `${ESC}[38;2;${r};${g};${b}m${text}${ESC}[39m`;
  return hyperlink(url, coloredText, { ...options, style: 'none' });
};

/**
 * Terminal-specific link formatting
 */
export const terminalLink = {
  /**
   * iTerm2 style (with inline image support marker)
   */
  iterm: (url: string, text: string): string => {
    if (!supportsHyperlinks()) return text;
    return `${OSC}8;;${url}${BEL}${text}${OSC}8;;${BEL}`;
  },
  
  /**
   * VTE/GNOME Terminal style
   */
  vte: (url: string, text: string): string => {
    if (!supportsHyperlinks()) return text;
    return `${OSC}8;;${url}${BEL}${text}${OSC}8;;${BEL}`;
  },
  
  /**
   * Kitty terminal style
   */
  kitty: (url: string, text: string): string => {
    if (!supportsHyperlinks()) return text;
    return `${OSC}8;;${url}${BEL}${text}${OSC}8;;${BEL}`;
  },
};

/**
 * Check and report hyperlink support status
 */
export const getHyperlinkSupport = () => {
  const env = typeof process !== 'undefined' ? process.env : {};
  
  return {
    supported: supportsHyperlinks(),
    terminal: env.TERM_PROGRAM || env.TERM || 'unknown',
    colorTerm: env.COLORTERM || 'unknown',
    forced: env.FORCE_HYPERLINK,
    vteVersion: env.VTE_VERSION,
  };
};