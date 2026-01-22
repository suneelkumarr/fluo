/**
 * BLITZ - Terminal Animations
 * Spinners, progress bars, and animated text effects
 */

import { ESC } from '../core/ansi';

/**
 * Cursor control sequences
 */
const cursor = {
  hide: `${ESC}[?25l`,
  show: `${ESC}[?25h`,
  up: (n: number = 1) => `${ESC}[${n}A`,
  down: (n: number = 1) => `${ESC}[${n}B`,
  forward: (n: number = 1) => `${ESC}[${n}C`,
  backward: (n: number = 1) => `${ESC}[${n}D`,
  column: (n: number = 1) => `${ESC}[${n}G`,
  home: `${ESC}[H`,
  clearLine: `${ESC}[2K`,
  clearScreen: `${ESC}[2J`,
  saveCursor: `${ESC}7`,
  restoreCursor: `${ESC}8`,
  scrollUp: `${ESC}[S`,
  scrollDown: `${ESC}[T`,
};

export { cursor };

/**
 * Spinner frame sets
 */
export const spinners = {
  dots: {
    frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    interval: 80,
  },
  dots2: {
    frames: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
    interval: 80,
  },
  dots3: {
    frames: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲', '⠳', '⠓'],
    interval: 80,
  },
  line: {
    frames: ['-', '\\', '|', '/'],
    interval: 100,
  },
  line2: {
    frames: ['⠂', '-', '–', '—', '–', '-'],
    interval: 100,
  },
  pipe: {
    frames: ['┤', '┘', '┴', '└', '├', '┌', '┬', '┐'],
    interval: 100,
  },
  star: {
    frames: ['✶', '✸', '✹', '✺', '✹', '✷'],
    interval: 70,
  },
  star2: {
    frames: ['+', 'x', '*'],
    interval: 80,
  },
  flip: {
    frames: ['_', '_', '_', '-', '`', '`', "'", '´', '-', '_', '_', '_'],
    interval: 70,
  },
  hamburger: {
    frames: ['☱', '☲', '☴'],
    interval: 100,
  },
  growVertical: {
    frames: ['▁', '▃', '▄', '▅', '▆', '▇', '▆', '▅', '▄', '▃'],
    interval: 120,
  },
  growHorizontal: {
    frames: ['▏', '▎', '▍', '▌', '▋', '▊', '▉', '▊', '▋', '▌', '▍', '▎'],
    interval: 120,
  },
  balloon: {
    frames: [' ', '.', 'o', 'O', '@', '*', ' '],
    interval: 140,
  },
  balloon2: {
    frames: ['.', 'o', 'O', '°', 'O', 'o', '.'],
    interval: 120,
  },
  noise: {
    frames: ['▓', '▒', '░'],
    interval: 100,
  },
  bounce: {
    frames: ['⠁', '⠂', '⠄', '⠂'],
    interval: 120,
  },
  boxBounce: {
    frames: ['▖', '▘', '▝', '▗'],
    interval: 120,
  },
  boxBounce2: {
    frames: ['▌', '▀', '▐', '▄'],
    interval: 100,
  },
  triangle: {
    frames: ['◢', '◣', '◤', '◥'],
    interval: 50,
  },
  arc: {
    frames: ['◜', '◠', '◝', '◞', '◡', '◟'],
    interval: 100,
  },
  circle: {
    frames: ['◡', '⊙', '◠'],
    interval: 120,
  },
  squareCorners: {
    frames: ['◰', '◳', '◲', '◱'],
    interval: 180,
  },
  circleQuarters: {
    frames: ['◴', '◷', '◶', '◵'],
    interval: 120,
  },
  circleHalves: {
    frames: ['◐', '◓', '◑', '◒'],
    interval: 50,
  },
  squish: {
    frames: ['╫', '╪'],
    interval: 100,
  },
  toggle: {
    frames: ['⊶', '⊷'],
    interval: 250,
  },
  toggle2: {
    frames: ['▫', '▪'],
    interval: 80,
  },
  toggle3: {
    frames: ['□', '■'],
    interval: 120,
  },
  toggle4: {
    frames: ['■', '□', '▪', '▫'],
    interval: 100,
  },
  toggle5: {
    frames: ['▮', '▯'],
    interval: 100,
  },
  toggle6: {
    frames: ['ဝ', '၀'],
    interval: 300,
  },
  toggle7: {
    frames: ['⦾', '⦿'],
    interval: 80,
  },
  toggle8: {
    frames: ['◍', '◌'],
    interval: 100,
  },
  toggle9: {
    frames: ['◉', '◎'],
    interval: 100,
  },
  arrow: {
    frames: ['←', '↖', '↑', '↗', '→', '↘', '↓', '↙'],
    interval: 100,
  },
  arrow2: {
    frames: ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'],
    interval: 80,
  },
  arrow3: {
    frames: ['▹▹▹▹▹', '▸▹▹▹▹', '▹▸▹▹▹', '▹▹▸▹▹', '▹▹▹▸▹', '▹▹▹▹▸'],
    interval: 120,
  },
  bouncingBar: {
    frames: [
      '[    ]',
      '[=   ]',
      '[==  ]',
      '[=== ]',
      '[ ===]',
      '[  ==]',
      '[   =]',
      '[    ]',
      '[   =]',
      '[  ==]',
      '[ ===]',
      '[====]',
      '[=== ]',
      '[==  ]',
      '[=   ]',
    ],
    interval: 80,
  },
  bouncingBall: {
    frames: [
      '( ●    )',
      '(  ●   )',
      '(   ●  )',
      '(    ● )',
      '(     ●)',
      '(    ● )',
      '(   ●  )',
      '(  ●   )',
      '( ●    )',
      '(●     )',
    ],
    interval: 80,
  },
  clock: {
    frames: ['🕛', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚'],
    interval: 100,
  },
  earth: {
    frames: ['🌍', '🌎', '🌏'],
    interval: 180,
  },
  moon: {
    frames: ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'],
    interval: 80,
  },
  runner: {
    frames: ['🚶', '🏃'],
    interval: 140,
  },
  pong: {
    frames: [
      '▐⠂       ▌',
      '▐⠈       ▌',
      '▐ ⠂      ▌',
      '▐ ⠠      ▌',
      '▐  ⡀     ▌',
      '▐  ⠠     ▌',
      '▐   ⠂    ▌',
      '▐   ⠈    ▌',
      '▐    ⠂   ▌',
      '▐    ⠠   ▌',
      '▐     ⡀  ▌',
      '▐     ⠠  ▌',
      '▐      ⠂ ▌',
      '▐      ⠈ ▌',
      '▐       ⠂▌',
      '▐       ⠠▌',
      '▐       ⡀▌',
      '▐      ⠠ ▌',
      '▐      ⠂ ▌',
      '▐     ⠈  ▌',
      '▐     ⠂  ▌',
      '▐    ⠠   ▌',
      '▐    ⡀   ▌',
      '▐   ⠠    ▌',
      '▐   ⠂    ▌',
      '▐  ⠈     ▌',
      '▐  ⠂     ▌',
      '▐ ⠠      ▌',
      '▐ ⡀      ▌',
      '▐⠠       ▌',
    ],
    interval: 80,
  },
  shark: {
    frames: [
      '▐|\\____________▌',
      '▐_|\\___________▌',
      '▐__|\\__________▌',
      '▐___|\\_________▌',
      '▐____|\\________▌',
      '▐_____|\\_______▌',
      '▐______|\\______▌',
      '▐_______|\\_____▌',
      '▐________|\\____▌',
      '▐_________|\\___▌',
      '▐__________|\\__▌',
      '▐___________|\\_▌',
      '▐____________|\\▌',
      '▐____________/|▌',
      '▐___________/|_▌',
      '▐__________/|__▌',
      '▐_________/|___▌',
      '▐________/|____▌',
      '▐_______/|_____▌',
      '▐______/|______▌',
      '▐_____/|_______▌',
      '▐____/|________▌',
      '▐___/|_________▌',
      '▐__/|__________▌',
      '▐_/|___________▌',
      '▐/|____________▌',
    ],
    interval: 120,
  },
  dqpb: {
    frames: ['d', 'q', 'p', 'b'],
    interval: 100,
  },
  weather: {
    frames: ['☀️', '☀️', '☀️', '🌤', '⛅️', '🌥', '☁️', '🌧', '🌨', '🌧', '🌨', '🌧', '🌨', '⛈', '🌨', '🌧', '🌨', '☁️', '🌥', '⛅️', '🌤', '☀️', '☀️'],
    interval: 100,
  },
  christmas: {
    frames: ['🌲', '🎄'],
    interval: 400,
  },
  layer: {
    frames: ['-', '=', '≡'],
    interval: 150,
  },
  betaWave: {
    frames: ['ρββββββ', 'βρβββββ', 'ββρββββ', 'βββρβββ', 'ββββρββ', 'βββββρβ', 'ββββββρ'],
    interval: 80,
  },
};

/**
 * Spinner type
 */
export type SpinnerName = keyof typeof spinners;

/**
 * Spinner instance
 */
export interface SpinnerInstance {
  start: (text?: string) => SpinnerInstance;
  stop: (finalText?: string) => void;
  succeed: (text?: string) => void;
  fail: (text?: string) => void;
  warn: (text?: string) => void;
  info: (text?: string) => void;
  update: (text: string) => void;
  isSpinning: () => boolean;
  text: string;
}

/**
 * Create a spinner instance
 */
export const createSpinner = (
  options: {
    spinner?: SpinnerName | { frames: string[]; interval: number };
    text?: string;
    color?: (s: string) => string;
    stream?: NodeJS.WriteStream;
    hideCursor?: boolean;
  } = {}
): SpinnerInstance => {
  const {
    spinner = 'dots',
    text: initialText = '',
    color = (s: string) => s,
    stream = process.stdout,
    hideCursor = true,
  } = options;

  const spinnerConfig = typeof spinner === 'string' ? spinners[spinner] : spinner;
  
  let frameIndex = 0;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let currentText = initialText;
  let isRunning = false;

  const render = () => {
    const frame = spinnerConfig.frames[frameIndex];
    frameIndex = (frameIndex + 1) % spinnerConfig.frames.length;
    
    stream.write(`${cursor.clearLine}${cursor.column(1)}${color(frame)} ${currentText}`);
  };

  const stopSymbols = {
    succeed: '✓',
    fail: '✗',
    warn: '⚠',
    info: 'ℹ',
  };

  const instance: SpinnerInstance = {
    text: initialText,
    
    start(text?: string) {
      if (isRunning) return this;
      
      if (text) currentText = text;
      isRunning = true;
      
      if (hideCursor) stream.write(cursor.hide);
      
      render();
      intervalId = setInterval(render, spinnerConfig.interval);
      
      return this;
    },
    
    stop(finalText?: string) {
      if (!isRunning) return;
      
      if (intervalId) clearInterval(intervalId);
      isRunning = false;
      
      stream.write(cursor.clearLine + cursor.column(1));
      if (finalText) stream.write(finalText + '\n');
      
      if (hideCursor) stream.write(cursor.show);
    },
    
    succeed(text?: string) {
      this.stop(`${color(stopSymbols.succeed)} ${text || currentText}`);
    },
    
    fail(text?: string) {
      this.stop(`${color(stopSymbols.fail)} ${text || currentText}`);
    },
    
    warn(text?: string) {
      this.stop(`${color(stopSymbols.warn)} ${text || currentText}`);
    },
    
    info(text?: string) {
      this.stop(`${color(stopSymbols.info)} ${text || currentText}`);
    },
    
    update(text: string) {
      currentText = text;
      this.text = text;
    },
    
    isSpinning() {
      return isRunning;
    },
  };

  return instance;
};

/**
 * Progress bar options
 */
export interface ProgressBarOptions {
  total?: number;
  width?: number;
  complete?: string;
  incomplete?: string;
  head?: string;
  format?: string;
  stream?: NodeJS.WriteStream;
  hideCursor?: boolean;
  clearOnComplete?: boolean;
}

/**
 * Progress bar instance
 */
export interface ProgressBarInstance {
  tick: (delta?: number, tokens?: Record<string, string | number>) => void;
  update: (ratio: number, tokens?: Record<string, string | number>) => void;
  render: (tokens?: Record<string, string | number>) => void;
  interrupt: (message: string) => void;
  terminate: () => void;
  complete: boolean;
  current: number;
  total: number;
}

/**
 * Create a progress bar
 */
export const createProgressBar = (options: ProgressBarOptions = {}): ProgressBarInstance => {
  const {
    total = 100,
    width = 40,
    complete = '█',
    incomplete = '░',
    head = '█',
    format = ':bar :percent :current/:total',
    stream = process.stdout,
    hideCursor = true,
    clearOnComplete = false,
  } = options;

  let current = 0;
  let isComplete = false;
  let lastRender = '';

  const render = (tokens: Record<string, string | number> = {}) => {
    const ratio = Math.min(Math.max(current / total, 0), 1);
    const percent = Math.floor(ratio * 100);
    const filled = Math.round(width * ratio);
    const empty = width - filled;
    
    const bar = 
      complete.repeat(Math.max(0, filled - 1)) + 
      (filled > 0 ? head : '') + 
      incomplete.repeat(empty);
    
    let output = format
      .replace(':bar', bar)
      .replace(':percent', `${percent}%`.padStart(4))
      .replace(':current', String(current))
      .replace(':total', String(total))
      .replace(':elapsed', '0s') // Could implement actual timing
      .replace(':eta', '0s');   // Could implement ETA
    
    // Replace custom tokens
    for (const [key, value] of Object.entries(tokens)) {
      output = output.replace(`:${key}`, String(value));
    }
    
    if (output !== lastRender) {
      stream.write(cursor.clearLine + cursor.column(1) + output);
      lastRender = output;
    }
  };

  if (hideCursor) {
    stream.write(cursor.hide);
  }

  const instance: ProgressBarInstance = {
    complete: false,
    current: 0,
    total,
    
    tick(delta: number = 1, tokens?: Record<string, string | number>) {
      current += delta;
      this.current = current;
      
      if (current >= total && !isComplete) {
        isComplete = true;
        this.complete = true;
        render(tokens);
        
        if (clearOnComplete) {
          stream.write(cursor.clearLine + cursor.column(1));
        } else {
          stream.write('\n');
        }
        
        if (hideCursor) stream.write(cursor.show);
      } else {
        render(tokens);
      }
    },
    
    update(ratio: number, tokens?: Record<string, string | number>) {
      current = Math.floor(ratio * total);
      this.current = current;
      render(tokens);
      
      if (current >= total && !isComplete) {
        isComplete = true;
        this.complete = true;
        stream.write('\n');
        if (hideCursor) stream.write(cursor.show);
      }
    },
    
    render(tokens?: Record<string, string | number>) {
      render(tokens);
    },
    
    interrupt(message: string) {
      stream.write(cursor.clearLine + cursor.column(1) + message + '\n');
      render();
    },
    
    terminate() {
      if (!isComplete) {
        stream.write(cursor.clearLine + cursor.column(1));
        if (hideCursor) stream.write(cursor.show);
      }
    },
  };

  return instance;
};

/**
 * Typewriter effect
 */
export const typewriter = async (
  text: string,
  options: {
    delay?: number;
    stream?: NodeJS.WriteStream;
    onChar?: (char: string) => void;
  } = {}
): Promise<void> => {
  const { delay = 50, stream = process.stdout, onChar } = options;
  
  for (const char of text) {
    stream.write(char);
    onChar?.(char);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
};

/**
 * Blinking text effect
 */
export const blink = (
  text: string,
  options: {
    interval?: number;
    visible?: string;
    hidden?: string;
  } = {}
): { start: () => void; stop: () => void } => {
  const { interval = 500, visible = text, hidden = ' '.repeat(text.length) } = options;
  
  let isVisible = true;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  
  return {
    start() {
      intervalId = setInterval(() => {
        isVisible = !isVisible;
        process.stdout.write(cursor.clearLine + cursor.column(1) + (isVisible ? visible : hidden));
      }, interval);
    },
    stop() {
      if (intervalId) {
        clearInterval(intervalId);
        process.stdout.write(cursor.clearLine + cursor.column(1) + visible + '\n');
      }
    },
  };
};

/**
 * Countdown animation
 */
export const countdown = async (
  seconds: number,
  options: {
    format?: (remaining: number) => string;
    onTick?: (remaining: number) => void;
    stream?: NodeJS.WriteStream;
  } = {}
): Promise<void> => {
  const { 
    format = (n: number) => `${n}...`, 
    onTick, 
    stream = process.stdout 
  } = options;
  
  for (let i = seconds; i >= 0; i--) {
    stream.write(cursor.clearLine + cursor.column(1) + format(i));
    onTick?.(i);
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  stream.write('\n');
};

/**
 * Scroll text horizontally
 */
export const scrollText = (
  text: string,
  width: number = 20,
  options: {
    interval?: number;
    padding?: string;
  } = {}
): { start: () => void; stop: () => void } => {
  const { interval = 150, padding = '   ' } = options;
  
  const fullText = text + padding;
  let offset = 0;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  
  return {
    start() {
      intervalId = setInterval(() => {
        const visible = (fullText + fullText).slice(offset, offset + width);
        process.stdout.write(cursor.clearLine + cursor.column(1) + visible);
        offset = (offset + 1) % fullText.length;
      }, interval);
    },
    stop() {
      if (intervalId) {
        clearInterval(intervalId);
        process.stdout.write(cursor.clearLine + cursor.column(1) + text.slice(0, width) + '\n');
      }
    },
  };
};

/**
 * Loading dots animation
 */
export const loadingDots = (
  baseText: string = 'Loading',
  options: {
    maxDots?: number;
    interval?: number;
  } = {}
): { start: () => void; stop: () => void } => {
  const { maxDots = 3, interval = 500 } = options;
  
  let dots = 0;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  
  return {
    start() {
      intervalId = setInterval(() => {
        dots = (dots + 1) % (maxDots + 1);
        process.stdout.write(
          cursor.clearLine + cursor.column(1) + 
          baseText + '.'.repeat(dots) + ' '.repeat(maxDots - dots)
        );
      }, interval);
    },
    stop() {
      if (intervalId) {
        clearInterval(intervalId);
        process.stdout.write(cursor.clearLine + cursor.column(1));
      }
    },
  };
};

/**
 * Frame-by-frame animation
 */
export const animate = (
  frames: string[],
  options: {
    interval?: number;
    loop?: boolean;
    stream?: NodeJS.WriteStream;
  } = {}
): { start: () => Promise<void>; stop: () => void } => {
  const { interval = 100, loop = true, stream = process.stdout } = options;
  
  let frameIndex = 0;
  let running = false;
  
  return {
    async start() {
      running = true;
      stream.write(cursor.hide);
      
      return new Promise<void>((resolve) => {
        const tick = () => {
          if (!running) {
            stream.write(cursor.show);
            resolve();
            return;
          }
          
          stream.write(cursor.clearLine + cursor.column(1) + frames[frameIndex]);
          frameIndex++;
          
          if (frameIndex >= frames.length) {
            if (loop) {
              frameIndex = 0;
            } else {
              running = false;
              stream.write('\n' + cursor.show);
              resolve();
              return;
            }
          }
          
          setTimeout(tick, interval);
        };
        
        tick();
      });
    },
    
    stop() {
      running = false;
    },
  };
};