/**
 * BLITZ - ANSI Escape Code Constants
 * Pre-computed for maximum performance
 */

// Escape sequence prefix
export const ESC = '\x1b[';
export const OSC = '\x1b]';
export const BEL = '\x07';
export const SEP = ';';

// Style codes [open, close]
export const STYLES = {
  // Modifiers
  reset: [0, 0],
  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  overline: [53, 55],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],
  doubleUnderline: [21, 24],
  blink: [5, 25],
  rapidBlink: [6, 25],
  framed: [51, 54],
  encircled: [52, 54],
  
  // Foreground colors
  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  
  // Foreground bright colors
  blackBright: [90, 39],
  gray: [90, 39],
  grey: [90, 39],
  redBright: [91, 39],
  greenBright: [92, 39],
  yellowBright: [93, 39],
  blueBright: [94, 39],
  magentaBright: [95, 39],
  cyanBright: [96, 39],
  whiteBright: [97, 39],
  
  // Background colors
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  
  // Background bright colors
  bgBlackBright: [100, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49],
  bgRedBright: [101, 49],
  bgGreenBright: [102, 49],
  bgYellowBright: [103, 49],
  bgBlueBright: [104, 49],
  bgMagentaBright: [105, 49],
  bgCyanBright: [106, 49],
  bgWhiteBright: [107, 49],
} as const;

// Pre-computed escape sequences for maximum speed
export const OPEN: Record<string, string> = {};
export const CLOSE: Record<string, string> = {};

// Pre-compute all sequences at module load (one-time cost)
for (const [name, [open, close]] of Object.entries(STYLES)) {
  OPEN[name] = `${ESC}${open}m`;
  CLOSE[name] = `${ESC}${close}m`;
}

// RGB color code generators
export const rgb = (r: number, g: number, b: number): string =>
  `${ESC}38;2;${r};${g};${b}m`;

export const bgRgb = (r: number, g: number, b: number): string =>
  `${ESC}48;2;${r};${g};${b}m`;

// ANSI 256 color code generators
export const ansi256 = (code: number): string =>
  `${ESC}38;5;${code}m`;

export const bgAnsi256 = (code: number): string =>
  `${ESC}48;5;${code}m`;

// Close codes
export const CLOSE_FG = `${ESC}39m`;
export const CLOSE_BG = `${ESC}49m`;

// Regex for stripping ANSI codes (compiled once)
export const ANSI_REGEX = /\x1b\[[0-9;]*m/g;
export const ANSI_REGEX_FULL = /\x1b(?:\[[0-9;]*m|\].*?(?:\x07|\x1b\\))/g;

// Hyperlink
export const hyperlink = (url: string, text: string): string =>
  `${OSC}8;;${url}${BEL}${text}${OSC}8;;${BEL}`;