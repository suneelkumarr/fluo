# 🎨 Fluo-Colors - Complete Feature Documentation

## All Features Reference

This document provides a complete reference of all 140+ features in fluo-colors.

---

## Table of Contents

1. [Basic Colors & Styles](#basic-colors--styles)
2. [Advanced Colors](#advanced-colors)
3. [Gradients & Effects](#gradients--effects)
4. [Tables](#tables)
5. [Charts & Graphs](#charts--graphs)
6. [Tree View](#tree-view)
7. [Emoji](#emoji)
8. [Markdown](#markdown)
9. [Diff Viewer](#diff-viewer)
10. [Interactive Prompts](#interactive-prompts)
11. [ASCII Art](#ascii-art)
12. [Terminal Utilities](#terminal-utilities)
13. [QR Codes](#qr-codes)
14. [Boxes](#boxes)
15. [Themes](#themes)
16. [Spinners & Progress](#spinners--progress)
17. [Utilities](#utilities)

---

## Basic Colors & Styles

### Colors (10)
```javascript
import { black, red, green, yellow, blue, magenta, cyan, white, gray, grey } from 'fluo-colors';
```

### Bright Colors (8)
```javascript
import { blackBright, redBright, greenBright, yellowBright, blueBright, magentaBright, cyanBright, whiteBright } from 'fluo-colors';
```

### Background Colors (16)
```javascript
import { bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite } from 'fluo-colors';
import { bgBlackBright, bgRedBright, bgGreenBright, bgYellowBright, bgBlueBright, bgMagentaBright, bgCyanBright, bgWhiteBright } from 'fluo-colors';
```

### Modifiers (10)
```javascript
import { reset, bold, dim, italic, underline, overline, inverse, hidden, strikethrough, visible } from 'fluo-colors';
```

---

## Advanced Colors

### RGB Colors
```javascript
import { rgb, bgRgbFn } from 'fluo-colors';
console.log(rgb(255, 87, 51)('Custom RGB color'));
```

### Hex Colors
```javascript
import { hex, bgHex } from 'fluo-colors';
console.log(hex('#FF5733')('Custom hex color'));
```

### HSL Colors
```javascript
import { hsl } from 'fluo-colors';
console.log(hsl(270, 60, 70)('HSL color'));
```

### ANSI 256 Colors
```javascript
import { ansi256Fn, bgAnsi256Fn } from 'fluo-colors';
console.log(ansi256Fn(208)('ANSI 256 color'));
```

---

## Gradients & Effects

### Built-in Gradients (13)
```javascript
import { rainbow, sunset, neon, fire, ice, matrix, ocean, pulse, sparkle, pride, trans, pastelRainbow, darkRainbow } from 'fluo-colors';

console.log(rainbow('Rainbow text!'));
console.log(sunset('Sunset gradient'));
```

### Custom Gradients
```javascript
import { gradient } from 'fluo-colors';
console.log(gradient('Custom gradient', ['#FF0000', '#00FF00', '#0000FF']));
```

---

## Tables

### Table Formatting (4 Border Styles)
```javascript
import { table } from 'fluo-colors';

const data = [
  ['Name', 'Age', 'City'],
  ['Alice', '25', 'NYC'],
  ['Bob', '30', 'LA']
];

console.log(table(data, { 
  header: true, 
  border: 'double' // single, double, rounded, bold, none
}));
```

---

## Charts & Graphs

### Bar Chart
```javascript
import { barChart } from 'fluo-colors';

console.log(barChart({
  data: [45, 78, 62, 91, 55],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  width: 30
}));
```

### Vertical Bar Chart
```javascript
import { verticalBarChart } from 'fluo-colors';
console.log(verticalBarChart({ data: [10, 20, 30], labels: ['A', 'B', 'C'] }));
```

### Sparkline
```javascript
import { sparkline } from 'fluo-colors';
console.log('Trend: ' + sparkline([10, 20, 15, 30, 25, 40]));
```

### Progress Bar
```javascript
import { progressBar } from 'fluo-colors';
console.log(progressBar(75, 100, { width: 40 }));
```

---

## Tree View

```javascript
import { tree } from 'fluo-colors';

const data = {
  name: 'project',
  children: [
    { name: 'src', children: [{ name: 'index.ts' }] },
    { name: 'package.json' }
  ]
};

console.log(tree(data));
```

---

## Emoji

### 100+ Named Emojis
```javascript
import { emoji, emojify, e } from 'fluo-colors';

console.log(emoji('rocket')); // 🚀
console.log(e.fire); // 🔥
console.log(emojify('Build :rocket: Deploy :fire:')); // Build 🚀 Deploy 🔥
```

---

## Markdown

```javascript
import { markdown } from 'fluo-colors';

const md = `
# Heading
**bold** and *italic*
- List item
\`code\`
`;

console.log(markdown(md));
```

---

## Diff Viewer

```javascript
import { diff } from 'fluo-colors';

const oldCode = 'function hello() {}';
const newCode = 'function hello(name) {}';

console.log(diff(oldCode, newCode, {
  context: 3,
  showLineNumbers: true
}));
```

---

## Interactive Prompts

### Text Input
```javascript
import { prompt } from 'fluo-colors';
const name = await prompt('What is your name?');
```

### Selection
```javascript
import { select } from 'fluo-colors';
const color = await select('Choose:', ['red', 'green', 'blue']);
```

### Confirmation
```javascript
import { confirm } from 'fluo-colors';
const proceed = await confirm('Continue?');
```

### Password
```javascript
import { password } from 'fluo-colors';
const pass = await password('Enter password:');
```

### Multi-line
```javascript
import { multiline } from 'fluo-colors';
const text = await multiline('Enter description:');
```

---

## ASCII Art

```javascript
import { figlet, banner } from 'fluo-colors';

console.log(figlet('FLUO'));
console.log(banner('HELLO', { border: true }));
```

---

## Terminal Utilities

```javascript
import { 
  getTerminalSize, 
  responsive, 
  centerText, 
  divider,
  clearScreen,
  moveCursor,
  hideCursor,
  showCursor
} from 'fluo-colors';

const size = getTerminalSize(); // { columns, rows }
console.log(responsive('Long text...', { maxWidth: 60 }));
console.log(centerText('Centered'));
console.log(divider('─'));
```

---

## QR Codes

```javascript
import { qrcode, qrcodeText } from 'fluo-colors';

console.log(qrcode('https://npmjs.com/fluo-colors'));
```

---

## Boxes

### Basic Box
```javascript
import { box } from 'fluo-colors';
console.log(box('Content'));
```

### Enhanced Boxes (5 Styles)
```javascript
import { enhancedBox, asciiBox, heavyBox, curvedBox } from 'fluo-colors';

console.log(asciiBox('ASCII borders'));
console.log(heavyBox('Heavy borders'));
console.log(curvedBox('Curved corners'));
console.log(enhancedBox('Content', { 
  style: 'heavy', 
  title: 'Title',
  titleAlign: 'center'
}));
```

---

## Themes

### Built-in Themes (10)
```javascript
import { theme, setTheme, createTheme } from 'fluo-colors';

console.log(theme.success('Success!'));
console.log(theme.error('Error!'));

setTheme('monokai'); // default, monokai, dracula, nord, github, solarized, minimal, ocean, sunset, forest
```

---

## Spinners & Progress

### Spinners (45+ Types)
```javascript
import { createSpinner } from 'fluo-colors';

const spinner = createSpinner({ text: 'Loading...' });
spinner.start();
setTimeout(() => spinner.succeed('Done!'), 2000);
```

### Progress Bars
```javascript
import { createProgressBar } from 'fluo-colors';

const bar = createProgressBar({ total: 100 });
bar.tick();
```

### Animations
```javascript
import { typewriter, countdown, blink } from 'fluo-colors';

await typewriter('Hello...', { delay: 50 });
await countdown(5);
```

---

## Utilities

### String Utilities
```javascript
import { stripAnsi, visibleLength, visibleCenter } from 'fluo-colors';
```

### Color Utilities
```javascript
import { hexToRgb, rgbToHex, lighten, darken } from 'fluo-colors';
```

### Detection
```javascript
import { detectColorLevel, supportsColor } from 'fluo-colors';
```

### Instance Creation
```javascript
import { Fluo, createInstance, fluoStderr } from 'fluo-colors';

const custom = new Fluo({ level: 2 });
```

### Notifications
```javascript
import { notify, notifySuccess, notifyError } from 'fluo-colors';

await notifySuccess('Build complete!');
```

---

## Summary

**Total Features**: 140+
- Basic colors & styles: 44
- Advanced colors: 7
- Gradients: 15
- Tables: 5 styles
- Charts: 4 types
- Tree view: 1
- Emoji: 100+
- Markdown: Full support
- Diff: Git-style
- Prompts: 5 types
- ASCII art: A-Z, 0-9
- Terminal: 10 utilities
- QR codes: 3 functions
- Boxes: 6 styles
- Themes: 10 built-in
- Spinners: 45+ types
- Animations: 6 types
- Utilities: 20+

**Zero dependencies. Production-ready. #1 Terminal Styling Package.**
