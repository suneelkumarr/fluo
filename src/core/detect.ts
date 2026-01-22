/**
 * BLITZ - Color Support Detection
 * Auto-detects terminal color capabilities
 */

import type { ColorLevel } from '../types';

// Cache detection result
let cachedLevel: ColorLevel | null = null;
let forceLevel: ColorLevel | null = null;

/**
 * Check if stdout is a TTY
 */
const isTTY = (): boolean => {
  if (typeof process === 'undefined') return false;
  return !!(process.stdout && process.stdout.isTTY);
};

/**
 * Get environment variable (safe for non-Node environments)
 */
const getEnv = (key: string): string | undefined => {
  if (typeof process === 'undefined') return undefined;
  return process.env?.[key];
};

/**
 * Detect color support level
 * 0 = No color support
 * 1 = Basic 16 colors
 * 2 = 256 colors
 * 3 = Truecolor (16 million colors)
 */
export const detectColorLevel = (): ColorLevel => {
  // Return forced level if set
  if (forceLevel !== null) return forceLevel;
  
  // Return cached result
  if (cachedLevel !== null) return cachedLevel;
  
  // NO_COLOR environment variable (https://no-color.org/)
  if (getEnv('NO_COLOR') !== undefined) {
    cachedLevel = 0;
    return 0;
  }
  
  // FORCE_COLOR environment variable
  const forceColor = getEnv('FORCE_COLOR');
  if (forceColor !== undefined) {
    if (forceColor === 'false' || forceColor === '0') {
      cachedLevel = 0;
      return 0;
    }
    if (forceColor === '' || forceColor === 'true' || forceColor === '1') {
      cachedLevel = 1;
      return 1;
    }
    if (forceColor === '2') {
      cachedLevel = 2;
      return 2;
    }
    if (forceColor === '3') {
      cachedLevel = 3;
      return 3;
    }
  }
  
  // CI environments
  if (getEnv('CI') !== undefined) {
    const ciProviders = ['GITHUB_ACTIONS', 'GITEA_ACTIONS', 'TRAVIS', 'CIRCLECI', 'GITLAB_CI'];
    for (const ci of ciProviders) {
      if (getEnv(ci) !== undefined) {
        cachedLevel = 3;
        return 3;
      }
    }
    cachedLevel = 1;
    return 1;
  }
  
  // Not a TTY
  if (!isTTY()) {
    cachedLevel = 0;
    return 0;
  }
  
  // Windows 10+ supports TrueColor
  const platform = typeof process !== 'undefined' ? process.platform : '';
  if (platform === 'win32') {
    const osRelease = getEnv('OS') || '';
    if (osRelease.includes('Windows')) {
      cachedLevel = 3;
      return 3;
    }
    cachedLevel = 1;
    return 1;
  }
  
  // COLORTERM environment
  const colorTerm = getEnv('COLORTERM');
  if (colorTerm === 'truecolor' || colorTerm === '24bit') {
    cachedLevel = 3;
    return 3;
  }
  
  // TERM environment
  const term = getEnv('TERM') || '';
  
  // 256 color terminals
  if (term.includes('256') || term.includes('256color')) {
    cachedLevel = 2;
    return 2;
  }
  
  // TrueColor terminals
  const trueColorTerms = [
    'iterm',
    'konsole',
    'terminator',
    'vscode',
    'hyper',
    'alacritty',
    'kitty',
    'wezterm',
    'rio',
  ];
  const termLower = term.toLowerCase();
  const termProgram = (getEnv('TERM_PROGRAM') || '').toLowerCase();
  
  for (const t of trueColorTerms) {
    if (termLower.includes(t) || termProgram.includes(t)) {
      cachedLevel = 3;
      return 3;
    }
  }
  
  // xterm and screen
  if (termLower.includes('xterm') || termLower.includes('screen')) {
    cachedLevel = 2;
    return 2;
  }
  
  // Fallback to basic colors
  if (termLower.includes('color') || termLower.includes('ansi') || termLower.includes('linux')) {
    cachedLevel = 1;
    return 1;
  }
  
  // Default: basic colors if TTY
  cachedLevel = 1;
  return 1;
};

/**
 * Force a specific color level
 */
export const setColorLevel = (level: ColorLevel): void => {
  forceLevel = level;
};

/**
 * Reset color level detection (re-detect on next call)
 */
export const resetColorLevel = (): void => {
  cachedLevel = null;
  forceLevel = null;
};

/**
 * Check if colors are supported
 */
export const supportsColor = (): boolean => detectColorLevel() > 0;

/**
 * Check if 256 colors are supported
 */
export const supports256 = (): boolean => detectColorLevel() >= 2;

/**
 * Check if TrueColor is supported
 */
export const supportsTrueColor = (): boolean => detectColorLevel() >= 3;

/**
 * Get color level info
 */
export const getColorInfo = () => ({
  level: detectColorLevel(),
  hasBasic: detectColorLevel() >= 1,
  has256: detectColorLevel() >= 2,
  hasTrueColor: detectColorLevel() >= 3,
});