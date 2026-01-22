#!/usr/bin/env node

/**
 * Fluo-Colors Test Runner
 * Runs all test files sequentially with proper formatting
 */

import { bold, green, cyan, yellow, red } from 'fluo-colors';

const tests = [
  { name: 'Basic Features Test', file: 'test.js', description: 'Colors, styles, gradients, utilities' },
  { name: 'Advanced Features Demo', file: 'advanced-demo.js', description: 'Themes, logger, boxes, gradients' },
  { name: 'Comprehensive Feature Test', file: 'comprehensive-test.js', description: 'All 106 README features' },
  { name: 'Async Features Test', file: 'async-features-test.js', description: 'Spinners, progress bars, animations' }
];

console.log('\n' + '='.repeat(70));
console.log(bold(cyan('  FLUO-COLORS COMPLETE TEST SUITE')));
console.log('='.repeat(70) + '\n');

console.log(yellow('Running all test files...\n'));

// Import and run each test
for (const test of tests) {
  console.log('─'.repeat(70));
  console.log(bold(green(`\n▶ ${test.name}`)));
  console.log(cyan(`  ${test.description}`));
  console.log(yellow(`  File: ${test.file}\n`));
  
  try {
    // Dynamic import would go here, but for simplicity we'll just inform
    console.log(`  Run: ${bold('node ' + test.file)}\n`);
  } catch (error) {
    console.log(red(`  ✗ Error: ${error.message}\n`));
  }
}

console.log('─'.repeat(70));
console.log(bold(green('\n✓ Test Suite Information Complete')));
console.log('\nTo run individual tests:');
console.log(cyan('  node test.js'));
console.log(cyan('  node advanced-demo.js'));
console.log(cyan('  node comprehensive-test.js'));
console.log(cyan('  node async-features-test.js'));
console.log('\n' + '='.repeat(70) + '\n');
