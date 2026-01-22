#!/usr/bin/env node

/**
 * BLITZ - Main Benchmark Suite
 * High-performance benchmarking using mitata
 * 
 * Run: node benchmark/bench.js
 */

import { run, bench, group, baseline } from 'mitata';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// ============================================
// Import Libraries
// ============================================

// FLUO (our library)
import fluo, {
  bold,
  red,
  green,
  blue,
  yellow,
  cyan,
  magenta,
  bgRed,
  bgBlue,
  stripAnsi,
  visibleLength,
} from '../dist/index.mjs';

// Competitors
import chalk from 'chalk';
import pc from 'picocolors';
import kleur from 'kleur';
import * as colorette from 'colorette';

// Try to import yoctocolors (ESM only)
let yocto;
try {
  yocto = await import('yoctocolors');
} catch {
  yocto = null;
}

// ============================================
// Test Data
// ============================================

const SHORT_STRING = 'Hello';
const MEDIUM_STRING = 'Hello World';
const LONG_STRING = 'The quick brown fox jumps over the lazy dog';
const VERY_LONG_STRING = LONG_STRING.repeat(10);

// Pre-create some styled strings for nesting tests
const nestedFluo = fluo.blue('nested');
const nestedChalk = chalk.blue('nested');
const nestedPc = pc.blue('nested');
const nestedKleur = kleur.blue('nested');
const nestedColorette = colorette.blue('nested');

// ============================================
// Benchmark Configuration
// ============================================

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    🔥 FLUO Benchmark Suite                       ║
╠══════════════════════════════════════════════════════════════════╣
║  Comparing: fluo, chalk, picocolors, kleur, colorette            ║
║  Node.js: ${process.version.padEnd(52)}║
║  Platform: ${process.platform}-${process.arch.padEnd(46)}║
╚══════════════════════════════════════════════════════════════════╝
`);

// ============================================
// Benchmark Groups
// ============================================

// Group 1: Simple single color
group('Single Color (red)', () => {
  baseline('fluo', () => fluo.red(MEDIUM_STRING));
  bench('fluo (fn)', () => red(MEDIUM_STRING));
  bench('chalk', () => chalk.red(MEDIUM_STRING));
  bench('picocolors', () => pc.red(MEDIUM_STRING));
  bench('kleur', () => kleur.red(MEDIUM_STRING));
  bench('colorette', () => colorette.red(MEDIUM_STRING));
  if (yocto) bench('yoctocolors', () => yocto.red(MEDIUM_STRING));
});

// Group 2: Bold modifier
group('Modifier (bold)', () => {
  baseline('fluo', () => fluo.bold(MEDIUM_STRING));
  bench('fluo (fn)', () => bold(MEDIUM_STRING));
  bench('chalk', () => chalk.bold(MEDIUM_STRING));
  bench('picocolors', () => pc.bold(MEDIUM_STRING));
  bench('kleur', () => kleur.bold(MEDIUM_STRING));
  bench('colorette', () => colorette.bold(MEDIUM_STRING));
  if (yocto) bench('yoctocolors', () => yocto.bold(MEDIUM_STRING));
});

// Group 3: Chained styles (2 levels)
group('Chain 2 (bold.red)', () => {
  baseline('fluo', () => fluo.bold.red(MEDIUM_STRING));
  bench('chalk', () => chalk.bold.red(MEDIUM_STRING));
  bench('kleur', () => kleur.bold().red(MEDIUM_STRING));
});

// Group 4: Chained styles (3 levels)
group('Chain 3 (bold.underline.red)', () => {
  baseline('fluo', () => fluo.bold.underline.red(MEDIUM_STRING));
  bench('chalk', () => chalk.bold.underline.red(MEDIUM_STRING));
  bench('kleur', () => kleur.bold().underline().red(MEDIUM_STRING));
});

// Group 5: Chained styles (4 levels)
group('Chain 4 (bold.italic.underline.cyan)', () => {
  baseline('fluo', () => fluo.bold.italic.underline.cyan(MEDIUM_STRING));
  bench('chalk', () => chalk.bold.italic.underline.cyan(MEDIUM_STRING));
  bench('kleur', () => kleur.bold().italic().underline().cyan(MEDIUM_STRING));
});

// Group 6: Background colors
group('Background (bgRed)', () => {
  baseline('fluo', () => fluo.bgRed(MEDIUM_STRING));
  bench('fluo (fn)', () => bgRed(MEDIUM_STRING));
  bench('chalk', () => chalk.bgRed(MEDIUM_STRING));
  bench('picocolors', () => pc.bgRed(MEDIUM_STRING));
  bench('kleur', () => kleur.bgRed(MEDIUM_STRING));
  bench('colorette', () => colorette.bgRed(MEDIUM_STRING));
});

// Group 7: Background + Foreground
group('BG + FG (bgRed.white)', () => {
  baseline('fluo', () => fluo.bgRed.white(MEDIUM_STRING));
  bench('chalk', () => chalk.bgRed.white(MEDIUM_STRING));
  bench('kleur', () => kleur.bgRed().white(MEDIUM_STRING));
});

// Group 8: Nested styles
group('Nested Styles', () => {
  baseline('fluo', () => fluo.red(`Hello ${nestedFluo} World`));
  bench('chalk', () => chalk.red(`Hello ${nestedChalk} World`));
  bench('picocolors', () => pc.red(`Hello ${nestedPc} World`));
  bench('kleur', () => kleur.red(`Hello ${nestedKleur} World`));
  bench('colorette', () => colorette.red(`Hello ${nestedColorette} World`));
});

// Group 9: Deep nesting
group('Deep Nesting (3 levels)', () => {
  baseline('fluo', () => 
    fluo.red(`a ${fluo.green(`b ${fluo.blue('c')} d`)} e`)
  );
  bench('chalk', () => 
    chalk.red(`a ${chalk.green(`b ${chalk.blue('c')} d`)} e`)
  );
  bench('picocolors', () => 
    pc.red(`a ${pc.green(`b ${pc.blue('c')} d`)} e`)
  );
});

// Group 10: RGB Colors (TrueColor)
group('RGB Color', () => {
  baseline('fluo', () => fluo.rgb(255, 100, 50)(MEDIUM_STRING));
  bench('chalk', () => chalk.rgb(255, 100, 50)(MEDIUM_STRING));
});

// Group 11: Hex Colors
group('Hex Color', () => {
  baseline('fluo', () => fluo.hex('#FF6432')(MEDIUM_STRING));
  bench('chalk', () => chalk.hex('#FF6432')(MEDIUM_STRING));
});

// Group 12: RGB Background
group('RGB Background', () => {
  baseline('fluo', () => fluo.bgRgb(100, 50, 255)(MEDIUM_STRING));
  bench('chalk', () => chalk.bgRgb(100, 50, 255)(MEDIUM_STRING));
});

// Group 13: Hex chained
group('Hex + Chain', () => {
  baseline('fluo', () => fluo.hex('#FF6432').bold.underline(MEDIUM_STRING));
  bench('chalk', () => chalk.hex('#FF6432').bold.underline(MEDIUM_STRING));
});

// Group 14: Template literals
group('Template Literal', () => {
  const name = 'World';
  baseline('fluo', () => fluo.red`Hello ${name}!`);
  bench('chalk', () => chalk.red`Hello ${name}!`);
});

// Group 15: Short strings
group('Short String (5 chars)', () => {
  baseline('fluo', () => fluo.red(SHORT_STRING));
  bench('chalk', () => chalk.red(SHORT_STRING));
  bench('picocolors', () => pc.red(SHORT_STRING));
  bench('kleur', () => kleur.red(SHORT_STRING));
  bench('colorette', () => colorette.red(SHORT_STRING));
});

// Group 16: Long strings
group('Long String (43 chars)', () => {
  baseline('fluo', () => fluo.red(LONG_STRING));
  bench('chalk', () => chalk.red(LONG_STRING));
  bench('picocolors', () => pc.red(LONG_STRING));
  bench('kleur', () => kleur.red(LONG_STRING));
  bench('colorette', () => colorette.red(LONG_STRING));
});

// Group 17: Very long strings
group('Very Long String (430 chars)', () => {
  baseline('fluo', () => fluo.red(VERY_LONG_STRING));
  bench('chalk', () => chalk.red(VERY_LONG_STRING));
  bench('picocolors', () => pc.red(VERY_LONG_STRING));
  bench('kleur', () => kleur.red(VERY_LONG_STRING));
  bench('colorette', () => colorette.red(VERY_LONG_STRING));
});

// Group 18: Empty string
group('Empty String', () => {
  baseline('fluo', () => fluo.red(''));
  bench('chalk', () => chalk.red(''));
  bench('picocolors', () => pc.red(''));
  bench('kleur', () => kleur.red(''));
  bench('colorette', () => colorette.red(''));
});

// Group 19: Multiple colors in sequence
group('Sequential Colors (3x)', () => {
  baseline('fluo', () => {
    fluo.red(SHORT_STRING);
    fluo.green(SHORT_STRING);
    fluo.blue(SHORT_STRING);
  });
  bench('chalk', () => {
    chalk.red(SHORT_STRING);
    chalk.green(SHORT_STRING);
    chalk.blue(SHORT_STRING);
  });
  bench('picocolors', () => {
    pc.red(SHORT_STRING);
    pc.green(SHORT_STRING);
    pc.blue(SHORT_STRING);
  });
});

// Group 20: Complex real-world scenario
group('Complex (error message)', () => {
  baseline('fluo', () => 
    fluo.bold.red(`Error: ${fluo.yellow('File not found')} at ${fluo.cyan.underline('/path/to/file')}`)
  );
  bench('chalk', () => 
    chalk.bold.red(`Error: ${chalk.yellow('File not found')} at ${chalk.cyan.underline('/path/to/file')}`)
  );
  bench('picocolors', () => 
    pc.bold(pc.red(`Error: ${pc.yellow('File not found')} at ${pc.underline(pc.cyan('/path/to/file'))}`))
  );
});

// Group 21: Strikethrough + dim
group('Modifiers (strikethrough.dim)', () => {
  baseline('fluo', () => fluo.strikethrough.dim(MEDIUM_STRING));
  bench('chalk', () => chalk.strikethrough.dim(MEDIUM_STRING));
  bench('kleur', () => kleur.strikethrough().dim(MEDIUM_STRING));
});

// Group 22: All basic colors
group('All Basic Colors', () => {
  baseline('fluo', () => {
    fluo.black(SHORT_STRING);
    fluo.red(SHORT_STRING);
    fluo.green(SHORT_STRING);
    fluo.yellow(SHORT_STRING);
    fluo.blue(SHORT_STRING);
    fluo.magenta(SHORT_STRING);
    fluo.cyan(SHORT_STRING);
    fluo.white(SHORT_STRING);
  });
  bench('chalk', () => {
    chalk.black(SHORT_STRING);
    chalk.red(SHORT_STRING);
    chalk.green(SHORT_STRING);
    chalk.yellow(SHORT_STRING);
    chalk.blue(SHORT_STRING);
    chalk.magenta(SHORT_STRING);
    chalk.cyan(SHORT_STRING);
    chalk.white(SHORT_STRING);
  });
  bench('picocolors', () => {
    pc.black(SHORT_STRING);
    pc.red(SHORT_STRING);
    pc.green(SHORT_STRING);
    pc.yellow(SHORT_STRING);
    pc.blue(SHORT_STRING);
    pc.magenta(SHORT_STRING);
    pc.cyan(SHORT_STRING);
    pc.white(SHORT_STRING);
  });
});

// Group 23: Bright colors
group('Bright Colors', () => {
  baseline('fluo', () => fluo.redBright(MEDIUM_STRING));
  bench('chalk', () => chalk.redBright(MEDIUM_STRING));
  bench('picocolors', () => pc.redBright(MEDIUM_STRING));
  bench('kleur', () => kleur.red(MEDIUM_STRING)); // kleur doesn't have bright
});

// Group 24: Gray/Grey alias
group('Gray Color', () => {
  baseline('fluo', () => fluo.gray(MEDIUM_STRING));
  bench('chalk', () => chalk.gray(MEDIUM_STRING));
  bench('picocolors', () => pc.gray(MEDIUM_STRING));
  bench('kleur', () => kleur.gray(MEDIUM_STRING));
  bench('colorette', () => colorette.gray(MEDIUM_STRING));
});

// Group 25: Visible/Inverse
group('Inverse Style', () => {
  baseline('fluo', () => fluo.inverse(MEDIUM_STRING));
  bench('chalk', () => chalk.inverse(MEDIUM_STRING));
  bench('picocolors', () => pc.inverse(MEDIUM_STRING));
  bench('kleur', () => kleur.inverse(MEDIUM_STRING));
});

// Group 26: Strip ANSI (utility)
group('Strip ANSI', () => {
  const styled = fluo.bold.red.underline(MEDIUM_STRING);
  baseline('fluo', () => stripAnsi(styled));
  // Note: chalk uses external strip-ansi package
});

// Group 27: Visible Length (utility)
group('Visible Length', () => {
  const styled = fluo.bold.red.underline(MEDIUM_STRING);
  baseline('fluo', () => visibleLength(styled));
});

// ============================================
// Run Benchmarks
// ============================================

await run({
  avg: true,
  json: false,
  colors: true,
  min_max: true,
  percentiles: false,
  collect: false,
});

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                      Benchmark Complete!                          ║
╚══════════════════════════════════════════════════════════════════╝
`);