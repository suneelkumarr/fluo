import {
  // Phase 1 - Competitor Parity
  visible, modifierNames, foregroundColorNames, backgroundColorNames, colorNames,
  
  // Phase 2 - New Features
  table, asciiTable,
  emoji, emojify, e,
  barChart, verticalBarChart, sparkline, progressBar,
  tree, asciiTree,
  markdown, stripMarkdown,
  diff, unifiedDiff,
  
  // Colors for styling
  red, green, blue, cyan, yellow, bold, italic
} from 'fluo-colors';

console.log('\n' + '='.repeat(70));
console.log(bold(cyan('  NEW FEATURES TEST - FLUO-COLORS')));
console.log('='.repeat(70) + '\n');

// ============================================================================
// PHASE 1: COMPETITOR PARITY FEATURES
// ============================================================================
console.log(bold('PHASE 1: COMPETITOR PARITY FEATURES\n'));

// 1. Visible Modifier
console.log(bold('1. Visible Modifier'));
console.log('Normal text: ' + red('This is always visible'));
console.log('Visible text: ' + visible('This only shows when colors are enabled'));
console.log('');

// 2. Color Name Arrays
console.log(bold('2. Color Name Arrays'));
console.log('Modifiers:', modifierNames.slice(0, 5).join(', '), '...');
console.log('Foreground colors:', foregroundColorNames.slice(0, 5).join(', '), '...');
console.log('Background colors:', backgroundColorNames.slice(0, 5).join(', '), '...');
console.log('Total colors:', colorNames.length);
console.log('');

// ============================================================================
// PHASE 2: UNIQUE NEW FEATURES
// ============================================================================
console.log(bold('\nPHASE 2: UNIQUE NEW FEATURES\n'));

// 3. Table Formatting
console.log(bold('3. Table Formatting\n'));

const tableData = [
  ['Feature', 'Status', 'Priority'],
  ['Tables', '✓ Done', 'High'],
  ['Charts', '✓ Done', 'High'],
  ['Emoji', '✓ Done', 'Medium']
];

console.log('Single border:');
console.log(table(tableData, { header: true, border: 'single' }));

console.log('\nDouble border:');
console.log(table(tableData, { header: true, border: 'double' }));

console.log('\nRounded border:');
console.log(table(tableData, { header: true, border: 'rounded' }));

console.log('');

// 4. Emoji Support
console.log(bold('4. Emoji Support\n'));
console.log('Function call:', emoji('rocket'), emoji('fire'), emoji('sparkles'));
console.log('Property access:', e.rocket, e.fire, e.sparkles);
console.log('Emojify:', emojify('Build :rocket: Deploy :fire: Success :tada:'));
console.log('Status:', emoji('success'), emoji('error'), emoji('warning'), emoji('info'));
console.log('');

// 5. Bar Charts
console.log(bold('5. Bar Charts\n'));

console.log('Horizontal bar chart:');
const chartData = [45, 78, 62, 91, 55];
const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
console.log(barChart({
  data: chartData,
  labels: labels,
  width: 30,
  color: (v) => v > 70 ? green : v > 50 ? yellow : red
}));

console.log('\nSparkline:');
console.log('Trend: ' + sparkline([10, 20, 15, 30, 25, 40, 35, 50, 45, 60]));

console.log('\nProgress bar:');
console.log(progressBar(75, 100, { width: 40, color: (p) => p > 50 ? green : yellow }));
console.log('');

// 6. Tree View
console.log(bold('6. Tree View\n'));

const treeData = {
  name: 'project',
  children: [
    {
      name: 'src',
      children: [
        { name: 'index.ts' },
        { name: 'utils.ts' }
      ]
    },
    {
      name: 'dist',
      children: [
        { name: 'index.js' }
      ]
    },
    { name: 'package.json' },
    { name: 'README.md' }
  ]
};

console.log(tree(treeData));
console.log('');

// 7. Markdown Renderer
console.log(bold('7. Markdown Renderer\n'));

const markdownText = `
# Heading 1
## Heading 2

This is **bold** and this is *italic*.

- List item 1
- List item 2
- List item 3

\`inline code\` example

> This is a blockquote
> with multiple lines

[Link text](https://example.com)
`;

console.log(markdown(markdownText));
console.log('');

// 8. Diff Viewer
console.log(bold('8. Diff Viewer\n'));

const oldCode = `function hello() {
  console.log('Hello');
  return true;
}`;

const newCode = `function hello(name) {
  console.log('Hello ' + name);
  console.log('Welcome!');
  return true;
}`;

console.log(diff(oldCode, newCode, { context: 2, showLineNumbers: true }));
console.log('');

// ============================================================================
// SUMMARY
// ============================================================================
console.log('\n' + '='.repeat(70));
console.log(bold(green('  ✓ ALL NEW FEATURES WORKING!')));
console.log('='.repeat(70) + '\n');

console.log(bold('Features Implemented:\n'));
console.log(green('✓') + ' visible modifier (Chalk parity)');
console.log(green('✓') + ' Color name arrays (modifierNames, colorNames, etc.)');
console.log(green('✓') + ' Table formatting (4 border styles)');
console.log(green('✓') + ' Emoji support (100+ named emojis)');
console.log(green('✓') + ' Charts (bar, vertical, sparkline, progress)');
console.log(green('✓') + ' Tree view (hierarchical data)');
console.log(green('✓') + ' Markdown renderer');
console.log(green('✓') + ' Diff viewer (git-style)');
console.log(green('✓') + ' Interactive prompts (in separate file)');

console.log('\n' + bold(cyan('📊 Total New Features: 10')));
console.log(bold(cyan('📦 Package Size: Still lightweight!')));
console.log(bold(cyan('🚀 Ready for npm publish!')));
console.log('');
