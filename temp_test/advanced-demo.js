import { 
  fluo, 
  gradient, 
  rainbow, 
  box, 
  createSpinner,
  createProgressBar,
  typewriter,
  theme,
  createLogger
} from 'fluo-colors';

console.log('\n=== Advanced Features Demo ===\n');

// Chaining with fluo object
console.log(fluo.bold.red.underline('Chained styling with fluo object'));
console.log(fluo.bgBlue.white.italic('Background + foreground + style'));

// Box feature
console.log('\n--- Box Feature ---');
console.log(box('This text is in a box!'));
console.log(box('Another boxed message', { padding: 1 }));

// Gradient with different color combinations
console.log('\n--- More Gradients ---');
console.log(gradient('Sunset Gradient', ['#ff6b6b', '#feca57', '#ee5a6f']));
console.log(gradient('Ocean Gradient', ['#0984e3', '#74b9ff', '#a29bfe']));
console.log(gradient('Forest Gradient', ['#00b894', '#55efc4', '#81ecec']));

// Rainbow variations
console.log('\n--- Rainbow Text ---');
console.log(rainbow('RAINBOW COLORS ARE AMAZING!'));

// Using theme
console.log('\n--- Themed Messages ---');
console.log(theme.success('✓ Operation completed successfully!'));
console.log(theme.error('✗ An error occurred!'));
console.log(theme.warning('⚠ Warning: Check your input!'));
console.log(theme.info('ℹ Information message'));

// Logger example
console.log('\n--- Logger Example ---');
const logger = createLogger();
logger.success('Task completed');
logger.error('Something went wrong');
logger.warn('Be careful');
logger.info('Just letting you know');

// Async spinner demo (commented out as it's async)
console.log('\n--- Spinner Demo (commented out - async) ---');
console.log('// const spinner = createSpinner("Loading...");');
console.log('// spinner.start();');
console.log('// setTimeout(() => spinner.stop(), 2000);');

console.log('\n=== Advanced Demo Complete ===\n');
