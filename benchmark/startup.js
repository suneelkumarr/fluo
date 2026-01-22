#!/usr/bin/env node

/**
 * BLITZ - Startup Time Benchmark
 * Measure cold-start import times
 * 
 * Run: node benchmark/startup.js
 */

import { spawn } from 'child_process';
import { performance } from 'perf_hooks';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ============================================
// Configuration
// ============================================

const RUNS = 20;

const libraries = [
  { name: 'blitz', import: 'import blitz from "../dist/index.mjs"' },
  { name: 'chalk', import: 'import chalk from "chalk"' },
  { name: 'picocolors', import: 'import pc from "picocolors"' },
  { name: 'kleur', import: 'import * as kleur from "kleur"' },
  { name: 'colorette', import: 'import * as colorette from "colorette"' },
];

// ============================================
// Utility Functions
// ============================================

const formatTime = (ms) => {
  if (ms < 1) return `${(ms * 1000).toFixed(2)} µs`;
  return `${ms.toFixed(2)} ms`;
};

const measureStartup = (importStatement) => {
  return new Promise((resolve, reject) => {
    const code = `
      const start = process.hrtime.bigint();
      ${importStatement};
      const end = process.hrtime.bigint();
      console.log(Number(end - start) / 1e6);
    `;
    
    const child = spawn('node', ['--input-type=module', '-e', code], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    
    let output = '';
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        resolve(null);
      } else {
        resolve(parseFloat(output.trim()));
      }
    });
    
    child.on('error', reject);
  });
};

// ============================================
// Run Benchmarks
// ============================================

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                     ⏱️  BLITZ Startup Time Benchmark                        ║
╠════════════════════════════════════════════════════════════════════════════╣
║  Runs per library: ${String(RUNS).padEnd(56)}║
║  Node.js: ${process.version.padEnd(66)}║
╚════════════════════════════════════════════════════════════════════════════╝
`);

const results = [];

for (const lib of libraries) {
  process.stdout.write(`\n🔍 Testing ${lib.name}...`);
  
  const times = [];
  
  for (let i = 0; i < RUNS; i++) {
    const time = await measureStartup(lib.import);
    if (time !== null) {
      times.push(time);
    }
    process.stdout.write('.');
  }
  
  if (times.length === 0) {
    console.log(` ❌ Failed`);
    continue;
  }
  
  times.sort((a, b) => a - b);
  
  const median = times[Math.floor(times.length / 2)];
  const min = times[0];
  const max = times[times.length - 1];
  const avg = times.reduce((a, b) => a + b) / times.length;
  
  results.push({
    name: lib.name,
    median,
    min,
    max,
    avg,
  });
  
  console.log(` ✅ ${formatTime(median)}`);
}

// ============================================
// Summary
// ============================================

console.log('\n\n📊 STARTUP TIME SUMMARY\n');
console.log('┌─────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐');
console.log('│ Package         │ Median       │ Min          │ Max          │ Average      │');
console.log('├─────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤');

results.sort((a, b) => a.median - b.median);

for (const r of results) {
  const isBest = r === results[0];
  const marker = isBest ? '🏆' : '  ';
  console.log(`│ ${marker}${r.name.padEnd(13)} │ ${formatTime(r.median).padStart(12)} │ ${formatTime(r.min).padStart(12)} │ ${formatTime(r.max).padStart(12)} │ ${formatTime(r.avg).padStart(12)} │`);
}

console.log('└─────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘');

// ============================================
// Relative Performance
// ============================================

console.log('\n📈 RELATIVE PERFORMANCE (vs fastest)\n');

const fastest = results[0];

for (const r of results) {
  const ratio = r.median / fastest.median;
  const barWidth = Math.round(ratio * 20);
  const bar = '█'.repeat(Math.min(barWidth, 40)) + '░'.repeat(Math.max(0, 40 - barWidth));
  const marker = r === fastest ? '🏆' : '  ';
  console.log(`${marker}${r.name.padEnd(13)} [${bar}] ${ratio.toFixed(2)}x`);
}

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                       Startup Benchmark Complete!                           ║
╚════════════════════════════════════════════════════════════════════════════╝
`);