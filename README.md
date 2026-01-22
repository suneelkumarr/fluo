# 🌈 Fluo Colors: The Fastest Terminal Styling Library for Node.js

[![npm version](https://img.shields.io/npm/v/fluo-colors.svg)](https://www.npmjs.com/package/fluo-colors)
[![bundle size](https://img.shields.io/bundlephobia/minzip/fluo-colors)](https://bundlephobia.com/package/fluo-colors)
[![downloads](https://img.shields.io/npm/dm/fluo-colors)](https://www.npmjs.com/package/fluo-colors)
[![license](https://img.shields.io/npm/l/fluo-colors)](https://github.com/yourusername/fluo/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)

**Fluo Colors** is an ultra-fast, zero-dependency library for styling terminal output in Node.js, Deno, and Bun. It offers a complete suite of CLI UI tools including **16 million colors (TrueColor)**, **gradients**, **spinners**, **progress bars**, and **box drawing**.

Engineered for performance, Fluo is significantly **faster than Chalk**, smaller than picocolors, and more feature-rich than both. It is the ultimate modern alternative for building beautiful command-line interfaces.

## ⚡ Why Choose Fluo?

- 🚀 **World-Class Performance**: Benchmarked as the fastest terminal styling library (38M+ ops/sec).
- 🛡️ **Zero Dependencies**: Lightweight (~4kB) with no bloat or security risks.
- 🎨 **True Color Support**: Full support for ANSI 256 and 16 million RGB colors.
- 🔧 **TypeScript Native**: First-class type definitions included out of the box.
- 🧩 **Rich UI Components**: Built-in spinners, progress bars, tables, and box drawing.
- 🌈 **Advanced Effects**: Gradients, rainbow text, and glitched animations.
- 🔄 **Universal Compatibility**: Works in Node.js, Deno, Bun, and browsers (console).

---

## 📑 Table of Contents

- [Benchmarks & Performance](#-performance)
- [Installation](#-installation)
- [Features Overview](#-features)
- [Usage Guide](#-usage)
  - [Basic Colors & Styles](#basic-styling)
  - [RGB, Hex & True Color](#true-color-rgbhexhsl)
  - [Gradients & Rainbows](#gradients)
  - [CLI Components (Spinners, Bars, Boxes)](#cli-components)
  - [Theming System](#themes)
- [API Reference](#-api-reference)
- [License](#-license)

---

## 🚀 Performance

Fluo is optimized for raw speed. It uses pre-computed ANSI codes and efficient string manipulation.

| Package | Size (Min+Gzip) | Load Time | Operations/sec | Dependencies |
|---------|-----------------|-----------|----------------|--------------|
| **fluo-colors (core)** | **~2.7 kB** | **~0.3ms** | **~132,000,000** | **0** |
| **fluo-colors (full)** | **~10.5 kB** | **~1ms** | **~132,000,000** | **0** |
| chalk | 4.4 kB | 6.17ms | ~370,000,000 | 0 |
| picocolors | 0.7 kB | 0.47ms | ~57,000,000 | 0 |
| colorette | 1.6 kB | 2.48ms | ~57,000,000 | 0 |
| kleur | 2.4 kB | 2.01ms | ~380,000,000 | 0 |

> **Note:** For the smallest bundle size, you can import from `fluo-colors/core` if you only need basic colors and styles. The full package includes gradients, themes, boxes, and animations.

---

## 📦 Installation

Install Fluo using your favorite package manager:

```bash
# npm
npm install fluo-colors

# yarn
yarn add fluo-colors

# pnpm
pnpm add fluo-colors

# bun
bun add fluo-colors
```

---

## ✨ Features

Fluo isn't just about colors; it's a complete toolkit for building professional CLIs.

- **Styles**: Bold, Dim, Italic, Underline, Inverse, Strikethrough, Hidden.
- **Colors**: Standard 16 colors, 256 ANSI colors, RGB, HEX, HSL.
- **Backgrounds**: Full background color support for all formats.
- **Gradients**: Linear interpolation, multi-stop gradients, and presets (Rainbow, Sunset, Neon).
- **UI Elements**: 
  - **Spinners**: Smooth, customizable loading indicators.
  - **Progress Bars**: ASCII progress tracking.
  - **Boxes**: Bordered text with titles and alignment.
- **Utilities**: ANSI stripping, string width calculation (visual length), and terminal capability detection.

---

## 📚 Usage

### Basic Styling

Import `fluo` to start styling your console output immediately. Chain methods for complex styles.

```typescript
import fluo, { b } from 'fluo-colors';

// Standard colors
console.log(fluo.red('Error: Something went wrong'));
console.log(fluo.green('Success: Operation completed'));
console.log(fluo.blue('Info: System stable'));

// Chained styles (Bold + Color + Background)
console.log(fluo.red.bold('CRITICAL ERROR'));
console.log(fluo.bgYellow.black.bold(' WARNING '));
console.log(fluo.underline.italic.cyan('Click here for details'));

// Template Literals (Tagged Templates)
console.log(fluo.red`System failure in module ${'Auth'}`);

// Short alias (b) for brevity
console.log(b.green.bold('Quick!'));
```

### True Color (RGB/Hex/HSL)

Access the full spectrum of 16 million colors using Hex, RGB, or HSL values. Fluo automatically downgrades colors for terminals that don't support TrueColor.

```typescript
// Hexadecimal Colors
console.log(fluo.hex('#FF5733')('Burnt Orange'));
console.log(fluo.bgHex('#282c34').hex('#61dafb')('React Theme'));

// RGB Colors
console.log(fluo.rgb(100, 149, 237)('Cornflower Blue'));
console.log(fluo.bgRgb(255, 255, 255).black('Black on White'));

// HSL Colors
console.log(fluo.hsl(270, 60, 70)('Soft Purple'));

// ANSI 256 Colors (for retro terminals)
console.log(fluo.ansi256(208)('Classic Orange'));
```

### Gradients

Create stunning gradient text effects for headers, banners, and emphasized text.

```typescript
import { rainbow, gradient, sunset, neon } from 'fluo-colors';

// Built-in Presets
console.log(rainbow('Unicorn magic!'));
console.log(sunset('Evening sky colors'));
console.log(neon('Cyberpunk aesthetic'));

// Custom Gradients (Linear Interpolation)
console.log(gradient('Custom Brand Colors', ['#ff0000', '#00ff00', '#0000ff']));

// Available Presets:
// rainbow, pastel, ocean, sunset, neon, fire, cool, warm,
// vice, mind, morning, fruit, instagram, atlas, retro
```

### CLI Components

Build rich CLI dashboards with built-in components.

#### Box Drawing
Wrap text in beautiful, customizable borders.

```typescript
import { box } from 'fluo-colors';

console.log(box('Installation Complete', {
  padding: 1,
  margin: 1,
  borderStyle: 'double', // single, double, round, bold, classic
  borderColor: '#00ff00',
  title: 'Status',
  titleAlignment: 'center',
  textAlignment: 'center'
}));
```

#### Spinners
Show activity for long-running processes.

```typescript
import { createSpinner } from 'fluo-colors';

const spinner = createSpinner({
  text: 'Downloading packages...',
  spinner: 'dots' // multiple presets available
}).start();

setTimeout(() => {
  spinner.succeed('Download complete!');
  // or spinner.fail('Download failed');
}, 2000);
```

#### Progress Bars
Track file uploads, installations, or processing tasks.

```typescript
import { createProgressBar } from 'fluo-colors';

const bar = createProgressBar({ 
  total: 100,
  width: 30,
  complete: '=',
  incomplete: '-',
  format: ':bar :percent :eta'
});

const timer = setInterval(() => {
  bar.tick();
  if (bar.complete) clearInterval(timer);
}, 50);
```

#### Other Animations
Fluo includes additional text effects for dynamic interfaces.

```typescript
import { typewriter, countdown, blink, scrollText } from 'fluo-colors';

// Typewriter effect
await typewriter('Welcome to the future of CLI...', { delay: 50 });

// Countdown
await countdown(5, { format: (n) => `Launching in ${n}...` });

// Blinking text (returns control object)
const blinking = blink('WARNING').start();
setTimeout(() => blinking.stop(), 3000);

// Scrolling text
const scroller = scrollText('Breaking News: Fluo is awesome! ', 20).start();
```

### Themes

Manage consistent styling across your application with the powerful Theme API. Compatible with popular color schemes like Dracula and Monokai.

```typescript
import { themes, createTheme } from 'fluo-colors';

// Use a built-in theme
// Presets: default, dracula, monokai, nord, solarized, github
const styles = createTheme(themes.dracula);

console.log(styles.success('✓ Built successfully'));
console.log(styles.error('✗ Build failed'));
console.log(styles.info('ℹ Building...'));

// Create your own semantic theme
const myTheme = createTheme({
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#eab308',
  info: '#06b6d4',
});
```

### Utilities

Helper functions for string manipulation in terminal environments.

```typescript
import { stripAnsi, visibleLength, hexToRgb } from 'fluo-colors';

// Remove ANSI codes (useful for logging to files)
const clean = stripAnsi('\x1b[31mRed\x1b[0m'); // "Red"

// Get the visual length of a string (ignoring hidden ANSI codes)
const width = visibleLength(fluo.red('Hello')); // 5

// Conversion helpers
const rgb = hexToRgb('#ff0000'); // [255, 0, 0]
```

---

## 🔧 Color Level Detection

Fluo automatically detects the capabilities of the running terminal (No Color, Basic, 256, or TrueColor) and downgrades styles accordingly.

You can override this behavior using environment variables or the API:

```typescript
import { detectColorLevel, setColorLevel } from 'fluo-colors';

console.log('Current Support Level:', detectColorLevel());
// 0: No Color
// 1: Basic (16 colors)
// 2: 256 Colors
// 3: TrueColor (16m colors)

// Force enable specific support
setColorLevel(3);
```

### Environment Variables
- `FORCE_COLOR`: Force color output (`0`, `1`, `2`, `3`).
- `NO_COLOR`: Disable all colors.
- `TERM` / `COLORTERM`: Used for auto-detection.

---

## 🎨 All Available Colors & Modifiers

### Modifiers
`reset`, `bold`, `dim`, `italic`, `underline`, `overline`, `inverse`, `hidden`, `strikethrough`

### Standard Colors
`black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`, `gray` (alias `grey`)

### Bright Colors (High Intensity)
`blackBright`, `redBright`, `greenBright`, `yellowBright`, `blueBright`, `magentaBright`, `cyanBright`, `whiteBright`

### Backgrounds
Prefix any color with `bg` (e.g., `bgRed`, `bgBlueBright`, `bgHex`).

---

## 📄 License

MIT © [Suneel Kumar](https://github.com/SuneelKumarr)

<p align="center">
  <sub>Made with ❤️ for the CLI community.</sub>
</p>
