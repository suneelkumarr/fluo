
// Types for Fluo

export type ColorLevel = 0 | 1 | 2 | 3;

export interface Styler {
  (text: unknown): string;
  (template: TemplateStringsArray, ...args: unknown[]): string;

  // Modifiers
  reset: Styler;
  bold: Styler;
  dim: Styler;
  italic: Styler;
  underline: Styler;
  overline: Styler;
  inverse: Styler;
  hidden: Styler;
  strikethrough: Styler;
  
  // Colors
  black: Styler;
  red: Styler;
  green: Styler;
  yellow: Styler;
  blue: Styler;
  magenta: Styler;
  cyan: Styler;
  white: Styler;
  gray: Styler;
  grey: Styler;
  
  // Bright Colors
  blackBright: Styler;
  redBright: Styler;
  greenBright: Styler;
  yellowBright: Styler;
  blueBright: Styler;
  magentaBright: Styler;
  cyanBright: Styler;
  whiteBright: Styler;
  
  // Background Colors
  bgBlack: Styler;
  bgRed: Styler;
  bgGreen: Styler;
  bgYellow: Styler;
  bgBlue: Styler;
  bgMagenta: Styler;
  bgCyan: Styler;
  bgWhite: Styler;
  
  // Bright Backgrounds
  bgBlackBright: Styler;
  bgRedBright: Styler;
  bgGreenBright: Styler;
  bgYellowBright: Styler;
  bgBlueBright: Styler;
  bgMagentaBright: Styler;
  bgCyanBright: Styler;
  bgWhiteBright: Styler;

  // Advanced
  hex(color: string): Styler;
  rgb(r: number, g: number, b: number): Styler;
  hsl(h: number, s: number, l: number): Styler;
  ansi256(code: number): Styler;
  bgHex(color: string): Styler;
  bgRgb(r: number, g: number, b: number): Styler;
  bgHsl(h: number, s: number, l: number): Styler;
  bgAnsi256(code: number): Styler;
}

export type fluoInstance = Styler;

export type RgbColor = [number, number, number];
export type HslColor = [number, number, number];

export type BasicColor = 
  | 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray' | 'grey';

export type BrightColor = 
  | 'blackBright' | 'redBright' | 'greenBright' | 'yellowBright' | 'blueBright' | 'magentaBright' | 'cyanBright' | 'whiteBright';

export type BgColor = 
  | 'bgBlack' | 'bgRed' | 'bgGreen' | 'bgYellow' | 'bgBlue' | 'bgMagenta' | 'bgCyan' | 'bgWhite';

export type Modifier = 
  | 'reset' | 'bold' | 'dim' | 'italic' | 'underline' | 'overline' | 'inverse' | 'hidden' | 'strikethrough';

export type StyleName = BasicColor | BrightColor | BgColor | Modifier | 
  'bgBlackBright' | 'bgRedBright' | 'bgGreenBright' | 'bgYellowBright' | 'bgBlueBright' | 'bgMagentaBright' | 'bgCyanBright' | 'bgWhiteBright';

export type BoxBorderStyle = 
  | 'single' 
  | 'double' 
  | 'round' 
  | 'bold' 
  | 'singleDouble' 
  | 'doubleSingle' 
  | 'classic' 
  | 'arrow';

export interface BoxOptions {
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  borderStyle?: BoxBorderStyle;
  borderColor?: string;
  backgroundColor?: string;
  title?: string;
  titleAlignment?: 'left' | 'center' | 'right';
  width?: number;
  height?: number;
  dimBorder?: boolean;
  float?: 'left' | 'center' | 'right';
  textAlignment?: 'left' | 'center' | 'right';
}

export interface SpinnerOptions {
  text?: string;
  color?: string;
  stream?: NodeJS.WritableStream;
  interval?: number;
  frames?: string[];
}

export interface ProgressBarOptions {
  width?: number;
  complete?: string;
  incomplete?: string;
  completeColor?: string;
  incompleteColor?: string;
  format?: string;
  stream?: NodeJS.WritableStream;
}

export interface Theme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  muted: string;
  [key: string]: string;
}

export interface GradientOptions {
  direction?: 'horizontal' | 'vertical';
  interpolation?: 'rgb' | 'hsl';
}
