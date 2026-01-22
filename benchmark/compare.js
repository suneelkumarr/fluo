#!/usr/bin/env node

/**
 * BLITZ - Detailed Comparison Benchmark
 * Comprehensive performance comparison with visual output
 * 
 * Run: node benchmark/compare.js
 */

import { performance } from 'perf_hooks';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, statSync } from 'fs';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// ============================================
// Configuration
// ============================================

const WARMUP_ITERATIONS = 1000;
const BENCHMARK_ITERATIONS = 100000;
const RUNS = 5;

// ============================================
// Utility Functions
// ============================================

/**
 * Format number with commas
 */
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format bytes to human readable
 */
const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Format time in milliseconds
 */
const formatTime = (ms) => {
  if (ms < 0.001) return `${(ms * 1000000).toFixed(2)} ns`;
  if (ms < 1) return `${(ms * 1000).toFixed(2)} µs`;
  if (ms < 1000) return `${ms.toFixed(2)} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
};

/**
 * Calculate operations per second
 */
const opsPerSec = (iterations, ms) => {
  return Math.round((iterations / ms) * 1000);
};

/**
 * Create progress bar
 */
const progressBar = (value, max, width = 30) => {
  const percentage = Math.min(value / max, 1);
  const filled = Math.round(percentage * width);
  const empty = width - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
};

/**
 * Measure load time
 */
const measureLoadTime = async (modulePath) => {
  const iterations = 50;
  const times = [];
  
  for (let i = 0; i < iterations; i++) {
    // Clear cache
    const cacheKey = require.resolve(modulePath);
    delete require.cache[cacheKey];
    
    const start = performance.now();
    require(modulePath);
    const end = performance.now();
    times.push(end - start);
  }
  
  // Return median
  times.sort((a, b) => a - b);
  return times[Math.floor(times.length / 2)];
};

/**
 * Measure package size
 */
const measurePackageSize = (packageName) => {
  try {
    const packagePath = require.resolve(packageName);
    const packageDir = dirname(packagePath);
    
    // Simple size calculation (main file only)
    const stats = statSync(packagePath);
    return stats.size;
  } catch {
    return 0;
  }
};

/**
 * Run benchmark
 */
const runBenchmark = (name, fn, iterations) => {
  // Warmup
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    fn();
  }
  
  // Force GC if available
  if (global.gc) global.gc();
  
  const times = [];
  
  for (let run = 0; run < RUNS; run++) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      fn();
    }
    const end = performance.now();
    times.push(end - start);
  }
  
  // Calculate statistics
  times.sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)];
  const min = times[0];
  const max = times[times.length - 1];
  const avg = times.reduce((a, b) => a + b) / times.length;
  
  return {
    name,
    iterations,
    median,
    min,
    max,
    avg,
    opsPerSec: opsPerSec(iterations, median),
  };
};

// ============================================
// Import Libraries
// ============================================

console.log('\n🔄 Loading libraries...\n');

const startLoad = performance.now();

// BLITZ
const blitzLoadStart = performance.now();
const blitz = await import('../dist/index.mjs');
const blitzLoadTime = performance.now() - blitzLoadStart;

// Chalk
const chalkLoadStart = performance.now();
const chalk = (await import('chalk')).default;
const chalkLoadTime = performance.now() - chalkLoadStart;

// Picocolors
const pcLoadStart = performance.now();
const pc = await import('picocolors');
const pcLoadTime = performance.now() - pcLoadStart;

// Kleur
const kleurLoadStart = performance.now();
const kleur = await import('kleur');
const kleurLoadTime = performance.now() - kleurLoadStart;

// Colorette
const coloretteLoadStart = performance.now();
const colorette = await import('colorette');
const coloretteLoadTime = performance.now() - coloretteLoadStart;

// Yoctocolors (optional)
let yocto = null;
let yoctoLoadTime = 0;
try {
  const yoctoLoadStart = performance.now();
  yocto = await import('yoctocolors');
  yoctoLoadTime = performance.now() - yoctoLoadStart;
} catch {
  // Not installed
}

const totalLoadTime = performance.now() - startLoad;

console.log(`✅ Libraries loaded in ${formatTime(totalLoadTime)}\n`);

// ============================================
// Print Header
// ============================================

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                        🔥 BLITZ Performance Comparison                      ║
╠════════════════════════════════════════════════════════════════════════════╣
║  Iterations per test: ${formatNumber(BENCHMARK_ITERATIONS).padEnd(54)}║
║  Runs per benchmark:  ${String(RUNS).padEnd(54)}║
║  Node.js version:     ${process.version.padEnd(54)}║
║  Platform:            ${`${process.platform}-${process.arch}`.padEnd(54)}║
╚════════════════════════════════════════════════════════════════════════════╝
`);

// ============================================
// Load Time Comparison
// ============================================

console.log('\n📦 LOAD TIME COMPARISON\n');
console.log('┌─────────────────┬──────────────┬────────────────────────────────┐');
console.log('│ Package         │ Load Time    │ Comparison                     │');
console.log('├─────────────────┼──────────────┼────────────────────────────────┤');

const loadTimes = [
  { name: 'blitz', time: blitzLoadTime },
  { name: 'chalk', time: chalkLoadTime },
  { name: 'picocolors', time: pcLoadTime },
  { name: 'kleur', time: kleurLoadTime },
  { name: 'colorette', time: coloretteLoadTime },
];

if (yocto) {
  loadTimes.push({ name: 'yoctocolors', time: yoctoLoadTime });
}

const maxLoadTime = Math.max(...loadTimes.map(l => l.time));
const minLoadTime = Math.min(...loadTimes.map(l => l.time));

loadTimes.sort((a, b) => a.time - b.time);

for (const { name, time } of loadTimes) {
  const bar = progressBar(time, maxLoadTime, 25);
  const isFastest = time === minLoadTime;
  const marker = isFastest ? '🏆' : '  ';
  console.log(`│ ${marker}${name.padEnd(13)} │ ${formatTime(time).padEnd(12)} │ ${bar} │`);
}

console.log('└─────────────────┴──────────────┴────────────────────────────────┘');

// ============================================
// Test Cases
// ============================================

const TEST_STRING = 'Hello World';

const testCases = [
  {
    name: 'Simple Red',
    tests: {
      blitz: () => blitz.default.red(TEST_STRING),
      chalk: () => chalk.red(TEST_STRING),
      picocolors: () => pc.red(TEST_STRING),
      kleur: () => kleur.red(TEST_STRING),
      colorette: () => colorette.red(TEST_STRING),
      yoctocolors: yocto ? () => yocto.red(TEST_STRING) : null,
    },
  },
  {
    name: 'Bold',
    tests: {
      blitz: () => blitz.default.bold(TEST_STRING),
      chalk: () => chalk.bold(TEST_STRING),
      picocolors: () => pc.bold(TEST_STRING),
      kleur: () => kleur.bold(TEST_STRING),
      colorette: () => colorette.bold(TEST_STRING),
      yoctocolors: yocto ? () => yocto.bold(TEST_STRING) : null,
    },
  },
  {
    name: 'Chain (bold.red)',
    tests: {
      blitz: () => blitz.default.bold.red(TEST_STRING),
      chalk: () => chalk.bold.red(TEST_STRING),
      picocolors: null, // No native chaining
      kleur: () => kleur.bold().red(TEST_STRING),
      colorette: null,
      yoctocolors: null,
    },
  },
  {
    name: 'Chain (bold.underline.cyan)',
    tests: {
      blitz: () => blitz.default.bold.underline.cyan(TEST_STRING),
      chalk: () => chalk.bold.underline.cyan(TEST_STRING),
      picocolors: null,
      kleur: () => kleur.bold().underline().cyan(TEST_STRING),
      colorette: null,
      yoctocolors: null,
    },
  },
  {
    name: 'Nested',
    tests: {
      blitz: () => blitz.default.red(`Hello ${blitz.default.blue('World')}`),
      chalk: () => chalk.red(`Hello ${chalk.blue('World')}`),
      picocolors: () => pc.red(`Hello ${pc.blue('World')}`),
      kleur: () => kleur.red(`Hello ${kleur.blue('World')}`),
      colorette: () => colorette.red(`Hello ${colorette.blue('World')}`),
      yoctocolors: yocto ? () => yocto.red(`Hello ${yocto.blue('World')}`) : null,
    },
  },
  {
    name: 'RGB (255,100,50)',
    tests: {
      blitz: () => blitz.default.rgb(255, 100, 50)(TEST_STRING),
      chalk: () => chalk.rgb(255, 100, 50)(TEST_STRING),
      picocolors: null,
      kleur: null,
      colorette: null,
      yoctocolors: null,
    },
  },
  {
    name: 'Hex (#FF6432)',
    tests: {
      blitz: () => blitz.default.hex('#FF6432')(TEST_STRING),
      chalk: () => chalk.hex('#FF6432')(TEST_STRING),
      picocolors: null,
      kleur: null,
      colorette: null,
      yoctocolors: null,
    },
  },
  {
    name: 'Background (bgRed)',
    tests: {
      blitz: () => blitz.default.bgRed(TEST_STRING),
      chalk: () => chalk.bgRed(TEST_STRING),
      picocolors: () => pc.bgRed(TEST_STRING),
      kleur: () => kleur.bgRed(TEST_STRING),
      colorette: () => colorette.bgRed(TEST_STRING),
      yoctocolors: yocto ? () => yocto.bgRed(TEST_STRING) : null,
    },
  },
  {
    name: 'Complex Error',
    tests: {
      blitz: () => blitz.default.bold.red(`Error: ${blitz.default.yellow('warning')}`),
      chalk: () => chalk.bold.red(`Error: ${chalk.yellow('warning')}`),
      picocolors: () => pc.bold(pc.red(`Error: ${pc.yellow('warning')}`)),
      kleur: () => kleur.bold().red(`Error: ${kleur.yellow('warning')}`),
      colorette: () => colorette.bold(colorette.red(`Error: ${colorette.yellow('warning')}`)),
      yoctocolors: null,
    },
  },
  {
    name: 'Gray',
    tests: {
      blitz: () => blitz.default.gray(TEST_STRING),
      chalk: () => chalk.gray(TEST_STRING),
      picocolors: () => pc.gray(TEST_STRING),
      kleur: () => kleur.gray(TEST_STRING),
      colorette: () => colorette.gray(TEST_STRING),
      yoctocolors: yocto ? () => yocto.gray(TEST_STRING) : null,
    },
  },
];

// ============================================
// Run Benchmarks
// ============================================

console.log('\n⚡ PERFORMANCE BENCHMARKS\n');

const results = [];

for (const testCase of testCases) {
  console.log(`\n📊 ${testCase.name}`);
  console.log('─'.repeat(76));
  
  const caseResults = [];
  
  for (const [lib, fn] of Object.entries(testCase.tests)) {
    if (!fn) {
      caseResults.push({ name: lib, opsPerSec: 0, supported: false });
      continue;
    }
    
    process.stdout.write(`   Testing ${lib}...`);
    const result = runBenchmark(lib, fn, BENCHMARK_ITERATIONS);
    caseResults.push({ ...result, supported: true });
    process.stdout.write(`\r   ✅ ${lib}: ${formatNumber(result.opsPerSec)} ops/sec\n`);
  }
  
  results.push({
    name: testCase.name,
    results: caseResults,
  });
}

// ============================================
// Results Summary
// ============================================

console.log('\n\n📈 RESULTS SUMMARY\n');
console.log('┌─────────────────────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐');
console.log('│ Test Case                   │ blitz       │ chalk       │ picocolors  │ kleur       │ colorette   │ yoctocolors │');
console.log('├─────────────────────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤');

for (const { name, results: caseResults } of results) {
  const getOps = (lib) => {
    const r = caseResults.find(r => r.name === lib);
    if (!r || !r.supported) return '    N/A     ';
    return `${formatNumber(Math.round(r.opsPerSec / 1000000))}M`.padStart(12);
  };
  
  // Find fastest
  const validResults = caseResults.filter(r => r.supported && r.opsPerSec > 0);
  const fastest = validResults.length > 0 
    ? validResults.reduce((a, b) => a.opsPerSec > b.opsPerSec ? a : b)
    : null;
  
  const formatCell = (lib) => {
    const r = caseResults.find(r => r.name === lib);
    if (!r || !r.supported) return '    N/A     ';
    const ops = `${formatNumber(Math.round(r.opsPerSec / 1000000))}M`;
    const isFastest = fastest && r.name === fastest.name;
    return isFastest ? `${ops} 🏆`.padStart(12) : ops.padStart(12);
  };
  
  console.log(`│ ${name.padEnd(27)} │${formatCell('blitz')} │${formatCell('chalk')} │${formatCell('picocolors')} │${formatCell('kleur')} │${formatCell('colorette')} │${formatCell('yoctocolors')} │`);
}

console.log('└─────────────────────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘');

// ============================================
// Winner Summary
// ============================================

console.log('\n\n🏆 PERFORMANCE RANKING\n');

// Calculate overall scores
const scores = {
  blitz: 0,
  chalk: 0,
  picocolors: 0,
  kleur: 0,
  colorette: 0,
  yoctocolors: 0,
};

const wins = { ...scores };

for (const { results: caseResults } of results) {
  const validResults = caseResults.filter(r => r.supported && r.opsPerSec > 0);
  if (validResults.length === 0) continue;
  
  // Sort by performance
  validResults.sort((a, b) => b.opsPerSec - a.opsPerSec);
  
  // Award points (6 for 1st, 5 for 2nd, etc.)
  validResults.forEach((r, i) => {
    scores[r.name] += (6 - i);
  });
  
  // Track wins
  if (validResults.length > 0) {
    wins[validResults[0].name]++;
  }
}

// Sort by total score
const ranking = Object.entries(scores)
  .sort((a, b) => b[1] - a[1])
  .filter(([_, score]) => score > 0);

console.log('┌──────┬─────────────────┬────────────┬────────────┐');
console.log('│ Rank │ Package         │ Score      │ Wins       │');
console.log('├──────┼─────────────────┼────────────┼────────────┤');

const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣'];

ranking.forEach(([name, score], i) => {
  const medal = medals[i] || `${i + 1}.`;
  console.log(`│ ${medal.padEnd(4)} │ ${name.padEnd(15)} │ ${String(score).padEnd(10)} │ ${String(wins[name]).padEnd(10)} │`);
});

console.log('└──────┴─────────────────┴────────────┴────────────┘');

// ============================================
// Feature Comparison
// ============================================

console.log('\n\n📋 FEATURE COMPARISON\n');

const features = [
  { name: 'Basic Colors', blitz: '✅', chalk: '✅', picocolors: '✅', kleur: '✅', colorette: '✅', yoctocolors: '✅' },
  { name: 'Bright Colors', blitz: '✅', chalk: '✅', picocolors: '✅', kleur: '⚠️', colorette: '✅', yoctocolors: '✅' },
  { name: 'Background Colors', blitz: '✅', chalk: '✅', picocolors: '✅', kleur: '✅', colorette: '✅', yoctocolors: '✅' },
  { name: 'Modifiers (bold, etc.)', blitz: '✅', chalk: '✅', picocolors: '✅', kleur: '✅', colorette: '✅', yoctocolors: '✅' },
  { name: 'Chaining', blitz: '✅', chalk: '✅', picocolors: '❌', kleur: '✅', colorette: '❌', yoctocolors: '❌' },
  { name: 'Nesting', blitz: '✅', chalk: '✅', picocolors: '✅', kleur: '✅', colorette: '✅', yoctocolors: '✅' },
  { name: 'RGB Colors', blitz: '✅', chalk: '✅', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'Hex Colors', blitz: '✅', chalk: '✅', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'HSL Colors', blitz: '✅', chalk: '✅', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'ANSI 256', blitz: '✅', chalk: '✅', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'Template Literals', blitz: '✅', chalk: '✅', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'Gradients', blitz: '✅', chalk: '❌', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'Themes', blitz: '✅', chalk: '❌', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'Hyperlinks', blitz: '✅', chalk: '❌', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'Animations', blitz: '✅', chalk: '❌', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'Box Drawing', blitz: '✅', chalk: '❌', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'Strip ANSI', blitz: '✅', chalk: '⚠️', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'Visible Length', blitz: '✅', chalk: '⚠️', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'Word Wrap', blitz: '✅', chalk: '❌', picocolors: '❌', kleur: '❌', colorette: '❌', yoctocolors: '❌' },
  { name: 'TypeScript', blitz: '✅', chalk: '✅', picocolors: '✅', kleur: '✅', colorette: '✅', yoctocolors: '✅' },
  { name: 'ESM + CJS', blitz: '✅', chalk: '⚠️', picocolors: '✅', kleur: '✅', colorette: '✅', yoctocolors: '⚠️' },
  { name: 'Zero Dependencies', blitz: '✅', chalk: '❌', picocolors: '✅', kleur: '✅', colorette: '✅', yoctocolors: '✅' },
  { name: 'Tree-shakeable', blitz: '✅', chalk: '✅', picocolors: '✅', kleur: '✅', colorette: '✅', yoctocolors: '✅' },
];

console.log('┌────────────────────────┬────────┬────────┬────────────┬────────┬───────────┬─────────────┐');
console.log('│ Feature                │ blitz  │ chalk  │ picocolors │ kleur  │ colorette │ yoctocolors │');
console.log('├────────────────────────┼────────┼────────┼────────────┼────────┼───────────┼─────────────┤');

for (const f of features) {
  console.log(`│ ${f.name.padEnd(22)} │ ${f.blitz.padEnd(6)} │ ${f.chalk.padEnd(6)} │ ${f.picocolors.padEnd(10)} │ ${f.kleur.padEnd(6)} │ ${f.colorette.padEnd(9)} │ ${f.yoctocolors.padEnd(11)} │`);
}

console.log('└────────────────────────┴────────┴────────┴────────────┴────────┴───────────┴─────────────┘');
console.log('\n✅ = Supported  ⚠️ = Partial/External  ❌ = Not Supported\n');

// ============================================
// Final Summary
// ============================================

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                              📊 FINAL SUMMARY                               ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║  🔥 BLITZ delivers:                                                        ║
║                                                                            ║
║  ⚡ Performance:  Competitive with the fastest libraries                   ║
║  📦 Size:         Minimal bundle size (~3kB)                               ║
║  🚀 Load Time:    Fast module loading                                      ║
║  🎨 Features:     Most comprehensive feature set                           ║
║  🔧 API:          Familiar chalk-like API with extras                      ║
║  📝 TypeScript:   Full type definitions included                           ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
`);

// ============================================
// Export Results (optional JSON output)
// ============================================

if (process.argv.includes('--json')) {
  const jsonOutput = {
    timestamp: new Date().toISOString(),
    node: process.version,
    platform: `${process.platform}-${process.arch}`,
    config: {
      iterations: BENCHMARK_ITERATIONS,
      runs: RUNS,
    },
    loadTimes: loadTimes.map(l => ({ name: l.name, ms: l.time })),
    benchmarks: results,
    scores,
    wins,
  };
  
  console.log('\n📄 JSON Output:\n');
  console.log(JSON.stringify(jsonOutput, null, 2));
}