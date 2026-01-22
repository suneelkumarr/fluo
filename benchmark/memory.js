#!/usr/bin/env node

/**
 * BLITZ - Memory Usage Benchmark
 * Measure memory consumption of different libraries
 * 
 * Run: node --expose-gc benchmark/memory.js
 */

import { performance } from 'perf_hooks';
import v8 from 'v8';

// ============================================
// Utility Functions
// ============================================

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getMemoryUsage = () => {
  if (global.gc) global.gc();
  return process.memoryUsage();
};

const getHeapStats = () => {
  return v8.getHeapStatistics();
};

// ============================================
// Memory Tests
// ============================================

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                      🧠 BLITZ Memory Usage Benchmark                        ║
╚════════════════════════════════════════════════════════════════════════════╝
`);

if (!global.gc) {
  console.log('⚠️  Warning: Run with --expose-gc for accurate measurements\n');
  console.log('   node --expose-gc benchmark/memory.js\n');
}

const ITERATIONS = 10000;
const TEST_STRING = 'Hello World';

const results = [];

// Baseline memory
const baselineMemory = getMemoryUsage();
console.log(`📊 Baseline Memory: ${formatBytes(baselineMemory.heapUsed)}\n`);

// ============================================
// Test Each Library
// ============================================

const libraries = [
  {
    name: 'blitz',
    import: async () => {
      const m = await import('../dist/index.mjs');
      return m.default;
    },
    test: (lib) => {
      for (let i = 0; i < ITERATIONS; i++) {
        lib.bold.red(TEST_STRING);
        lib.blue(`Hello ${lib.green('World')}`);
        lib.hex('#FF5733')(TEST_STRING);
      }
    },
  },
  {
    name: 'chalk',
    import: async () => {
      const m = await import('chalk');
      return m.default;
    },
    test: (lib) => {
      for (let i = 0; i < ITERATIONS; i++) {
        lib.bold.red(TEST_STRING);
        lib.blue(`Hello ${lib.green('World')}`);
        lib.hex('#FF5733')(TEST_STRING);
      }
    },
  },
  {
    name: 'picocolors',
    import: async () => {
      return await import('picocolors');
    },
    test: (lib) => {
      for (let i = 0; i < ITERATIONS; i++) {
        lib.bold(lib.red(TEST_STRING));
        lib.blue(`Hello ${lib.green('World')}`);
        lib.red(TEST_STRING); // No hex support
      }
    },
  },
  {
    name: 'kleur',
    import: async () => {
      return await import('kleur');
    },
    test: (lib) => {
      for (let i = 0; i < ITERATIONS; i++) {
        lib.bold().red(TEST_STRING);
        lib.blue(`Hello ${lib.green('World')}`);
        lib.red(TEST_STRING);
      }
    },
  },
  {
    name: 'colorette',
    import: async () => {
      return await import('colorette');
    },
    test: (lib) => {
      for (let i = 0; i < ITERATIONS; i++) {
        lib.bold(lib.red(TEST_STRING));
        lib.blue(`Hello ${lib.green('World')}`);
        lib.red(TEST_STRING);
      }
    },
  },
];

for (const { name, import: importFn, test } of libraries) {
  console.log(`\n🔍 Testing ${name}...`);
  
  // Force GC before test
  if (global.gc) global.gc();
  const beforeImport = getMemoryUsage();
  
  // Import library
  const importStart = performance.now();
  let lib;
  try {
    lib = await importFn();
  } catch (e) {
    console.log(`   ❌ Failed to import: ${e.message}`);
    continue;
  }
  const importTime = performance.now() - importStart;
  
  if (global.gc) global.gc();
  const afterImport = getMemoryUsage();
  const importMemory = afterImport.heapUsed - beforeImport.heapUsed;
  
  // Run test
  const testStart = performance.now();
  test(lib);
  const testTime = performance.now() - testStart;
  
  if (global.gc) global.gc();
  const afterTest = getMemoryUsage();
  const testMemory = afterTest.heapUsed - afterImport.heapUsed;
  
  results.push({
    name,
    importTime,
    importMemory,
    testTime,
    testMemory,
    totalMemory: afterTest.heapUsed - beforeImport.heapUsed,
  });
  
  console.log(`   Import: ${importTime.toFixed(2)}ms, Memory: ${formatBytes(importMemory)}`);
  console.log(`   Test:   ${testTime.toFixed(2)}ms, Memory: ${formatBytes(testMemory)}`);
}

// ============================================
// Summary Table
// ============================================

console.log('\n\n📊 MEMORY USAGE SUMMARY\n');
console.log('┌─────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐');
console.log('│ Package         │ Import Time  │ Import Mem   │ Test Time    │ Test Mem     │');
console.log('├─────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤');

results.sort((a, b) => a.totalMemory - b.totalMemory);

for (const r of results) {
  const isBest = r === results[0];
  const marker = isBest ? '🏆' : '  ';
  console.log(`│ ${marker}${r.name.padEnd(13)} │ ${r.importTime.toFixed(2).padStart(9)}ms │ ${formatBytes(r.importMemory).padStart(12)} │ ${r.testTime.toFixed(2).padStart(9)}ms │ ${formatBytes(r.testMemory).padStart(12)} │`);
}

console.log('└─────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘');

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                         Memory Benchmark Complete!                          ║
╚════════════════════════════════════════════════════════════════════════════╝
`);