
/**
 * fluo - Ultra-Fast Terminal Styling
 * 
 * @example
 * ```ts
 * import { fluo, b } from 'fluo';
 * 
 * // Chaining
 * console.log(fluo.bold.red('Hello World'));
 * 
 * // Nesting
 * console.log(fluo.red(`Hello ${fluo.bold('World')}`));
 * 
 * // Template literals
 * console.log(fluo.blue`Hello ${'World'}`);
 * 
 * // RGB/Hex
 * console.log(fluo.hex('#FF5733')('Custom color'));
 * console.log(fluo.rgb(255, 87, 51)('RGB color'));
 * 
 * // Advanced
 * import { gradient, box, createSpinner } from 'fluo';
 * console.log(gradient('Hello', ['red', 'blue']));
 * console.log(box('Hello'));
 * ```
 */

import { OPEN, CLOSE, hyperlink as createHyperlink } from './core/ansi';
import { hexToRgb, hslToRgb } from './core/colors';
import { applyStyle, applyRgb, applyAnsi256, fluo, options } from './core/factory';
import { Fluo, createInstance } from './core/instance';

// Main export
export { fluo, options };

// Instance creation
export { Fluo, createInstance };

// Stderr instance (separate color detection for stderr)
export const fluoStderr = fluo; // Simplified - same as stdout for now

// Short alias
export const b = fluo;

// Individual style functions for tree-shaking
export const reset = (s: string) => applyStyle(s, OPEN.reset, CLOSE.reset);
export const bold = (s: string) => applyStyle(s, OPEN.bold, CLOSE.bold);
export const dim = (s: string) => applyStyle(s, OPEN.dim, CLOSE.dim);
export const italic = (s: string) => applyStyle(s, OPEN.italic, CLOSE.italic);
export const underline = (s: string) => applyStyle(s, OPEN.underline, CLOSE.underline);
export const overline = (s: string) => applyStyle(s, OPEN.overline, CLOSE.overline);
export const inverse = (s: string) => applyStyle(s, OPEN.inverse, CLOSE.inverse);
export const hidden = (s: string) => applyStyle(s, OPEN.hidden, CLOSE.hidden);
export const strikethrough = (s: string) => applyStyle(s, OPEN.strikethrough, CLOSE.strikethrough);
export const visible = (s: string) => options.enabled ? s : '';

// Colors
export const black = (s: string) => applyStyle(s, OPEN.black, CLOSE.black);
export const red = (s: string) => applyStyle(s, OPEN.red, CLOSE.red);
export const green = (s: string) => applyStyle(s, OPEN.green, CLOSE.green);
export const yellow = (s: string) => applyStyle(s, OPEN.yellow, CLOSE.yellow);
export const blue = (s: string) => applyStyle(s, OPEN.blue, CLOSE.blue);
export const magenta = (s: string) => applyStyle(s, OPEN.magenta, CLOSE.magenta);
export const cyan = (s: string) => applyStyle(s, OPEN.cyan, CLOSE.cyan);
export const white = (s: string) => applyStyle(s, OPEN.white, CLOSE.white);
export const gray = (s: string) => applyStyle(s, OPEN.gray, CLOSE.gray);
export const grey = gray;

// Bright colors
export const blackBright = (s: string) => applyStyle(s, OPEN.blackBright, CLOSE.blackBright);
export const redBright = (s: string) => applyStyle(s, OPEN.redBright, CLOSE.redBright);
export const greenBright = (s: string) => applyStyle(s, OPEN.greenBright, CLOSE.greenBright);
export const yellowBright = (s: string) => applyStyle(s, OPEN.yellowBright, CLOSE.yellowBright);
export const blueBright = (s: string) => applyStyle(s, OPEN.blueBright, CLOSE.blueBright);
export const magentaBright = (s: string) => applyStyle(s, OPEN.magentaBright, CLOSE.magentaBright);
export const cyanBright = (s: string) => applyStyle(s, OPEN.cyanBright, CLOSE.cyanBright);
export const whiteBright = (s: string) => applyStyle(s, OPEN.whiteBright, CLOSE.whiteBright);

// Background colors
export const bgBlack = (s: string) => applyStyle(s, OPEN.bgBlack, CLOSE.bgBlack);
export const bgRed = (s: string) => applyStyle(s, OPEN.bgRed, CLOSE.bgRed);
export const bgGreen = (s: string) => applyStyle(s, OPEN.bgGreen, CLOSE.bgGreen);
export const bgYellow = (s: string) => applyStyle(s, OPEN.bgYellow, CLOSE.bgYellow);
export const bgBlue = (s: string) => applyStyle(s, OPEN.bgBlue, CLOSE.bgBlue);
export const bgMagenta = (s: string) => applyStyle(s, OPEN.bgMagenta, CLOSE.bgMagenta);
export const bgCyan = (s: string) => applyStyle(s, OPEN.bgCyan, CLOSE.bgCyan);
export const bgWhite = (s: string) => applyStyle(s, OPEN.bgWhite, CLOSE.bgWhite);

// Bright backgrounds
export const bgBlackBright = (s: string) => applyStyle(s, OPEN.bgBlackBright, CLOSE.bgBlackBright);
export const bgRedBright = (s: string) => applyStyle(s, OPEN.bgRedBright, CLOSE.bgRedBright);
export const bgGreenBright = (s: string) => applyStyle(s, OPEN.bgGreenBright, CLOSE.bgGreenBright);
export const bgYellowBright = (s: string) => applyStyle(s, OPEN.bgYellowBright, CLOSE.bgYellowBright);
export const bgBlueBright = (s: string) => applyStyle(s, OPEN.bgBlueBright, CLOSE.bgBlueBright);
export const bgMagentaBright = (s: string) => applyStyle(s, OPEN.bgMagentaBright, CLOSE.bgMagentaBright);
export const bgCyanBright = (s: string) => applyStyle(s, OPEN.bgCyanBright, CLOSE.bgCyanBright);
export const bgWhiteBright = (s: string) => applyStyle(s, OPEN.bgWhiteBright, CLOSE.bgWhiteBright);

// RGB/Hex functions
export const rgb = (r: number, g: number, b: number) => (s: string) => applyRgb(s, r, g, b, false);
export const bgRgbFn = (r: number, g: number, b: number) => (s: string) => applyRgb(s, r, g, b, true);

export const hex = (color: string) => {
  const [r, g, b] = hexToRgb(color);
  return (s: string) => applyRgb(s, r, g, b, false);
};

export const bgHex = (color: string) => {
  const [r, g, b] = hexToRgb(color);
  return (s: string) => applyRgb(s, r, g, b, true);
};

export const hsl = (h: number, s: number, l: number) => {
  const [r, g, b] = hslToRgb(h, s, l);
  return (text: string) => applyRgb(text, r, g, b, false);
};

export const ansi256Fn = (code: number) => (s: string) => applyAnsi256(s, code, false);
export const bgAnsi256Fn = (code: number) => (s: string) => applyAnsi256(s, code, true);

// Hyperlink
export const hyperlink = (url: string, text: string): string => {
  if (!options.enabled) return text;
  return createHyperlink(url, text);
};

// Advanced features
export { gradient, multilineGradient, gradients, createGradient } from './advanced/gradient';
export { rainbow, neon, fire, ice, matrix, ocean, sunset, pulse, sparkle, pride, trans, pastelRainbow, darkRainbow } from './advanced/rainbow';
export { box, frame } from './advanced/box';
export {
  themes, createTheme, getTheme, setTheme, registerTheme, getThemeNames, getStyles, theme, extendTheme, resetTheme, createLogger, palette
} from './advanced/themes';
export {
  createSpinner, createProgressBar, typewriter, blink, countdown, scrollText, loadingDots, animate, spinners
} from './advanced/animations';

// Utilities
export { ANSI_REGEX, ANSI_REGEX_FULL } from './core/ansi';
export { stripAnsi, stripAnsiAll, hasAnsi, extractAnsi } from './utils/strip';
export { visibleLength, visibleTruncate, visiblePadEnd, visiblePadStart, visiblePadBoth, visibleCenter, visibleAlign } from './utils/visible';
export { wrap, wrapLines, wrapToTerminal, columns, block } from './utils/wrap';
export { table, asciiTable } from './utils/table';
export { emoji, emojify, e, emojiMap } from './utils/emoji';
export { barChart, verticalBarChart, sparkline, progressBar } from './utils/charts';
export { tree, asciiTree } from './utils/tree';
export { markdown, stripMarkdown } from './utils/markdown';
export { diff, unifiedDiff } from './utils/diff';
export { prompt, select, confirm, password, multiline } from './utils/prompts';
export { figlet, banner } from './utils/figlet';
export { getTerminalSize, isInteractive, responsive, centerText, fitToTerminal, divider, clearScreen, moveCursor, hideCursor, showCursor } from './utils/terminal';
export { qrcode, qrcodeText, qrcodeURL } from './utils/qrcode';
export { notify, notifySuccess, notifyError, notifyWarning, notifyInfo } from './utils/notifications';
export { enhancedBox, asciiBox, heavyBox, curvedBox } from './utils/enhanced-box';

// Export detection utilities
export {
  detectColorLevel,
  setColorLevel,
  resetColorLevel,
  supportsColor,
  supports256,
  supportsTrueColor
} from './core/detect';

// Export color utilities
export {
  hexToRgb,
  rgbToHex,
  hslToRgb,
  rgbToHsl,
  rgbToAnsi256,
  ansi256ToRgb,
  interpolateRgb,
  interpolateHsl,
  getContrastColor,
  lighten,
  darken,
  saturate,
  desaturate,
} from './core/colors';

// Export color/modifier name arrays for validation
export const modifierNames = [
  'reset', 'bold', 'dim', 'italic', 'underline', 'overline',
  'inverse', 'hidden', 'strikethrough', 'visible'
] as const;

export const foregroundColorNames = [
  'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey',
  'blackBright', 'redBright', 'greenBright', 'yellowBright',
  'blueBright', 'magentaBright', 'cyanBright', 'whiteBright'
] as const;

export const backgroundColorNames = [
  'bgBlack', 'bgRed', 'bgGreen', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan', 'bgWhite',
  'bgBlackBright', 'bgRedBright', 'bgGreenBright', 'bgYellowBright',
  'bgBlueBright', 'bgMagentaBright', 'bgCyanBright', 'bgWhiteBright'
] as const;

export const colorNames = [...foregroundColorNames, ...backgroundColorNames] as const;

// Export types
export type {
  ColorLevel,
  StyleName,
  Styler,
  RgbColor,
  HslColor,
  BoxOptions,
  SpinnerOptions,
  ProgressBarOptions,
  Theme,
} from './types';

// Default export
export default fluo;
