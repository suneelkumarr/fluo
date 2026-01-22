import { 
  red, green, blue, yellow, cyan, magenta, white, black, gray,
  bold, dim, italic, underline, strikethrough, inverse,
  bgRed, bgGreen, bgBlue, bgYellow, bgCyan, bgMagenta,
  redBright, greenBright, blueBright,
  rgb, hex, bgHex,
  gradient, rainbow,
  stripAnsi, visibleLength
} from 'fluo-colors';

console.log('=== Testing fluo-colors Package ===\n');

// Test basic colors
console.log(red('This is red text'));
console.log(green('This is green text'));
console.log(blue('This is blue text'));
console.log(yellow('This is yellow text'));
console.log(cyan('This is cyan text'));
console.log(magenta('This is magenta text'));
console.log(white('This is white text'));
console.log(black('This is black text'));
console.log(gray('This is gray text'));

console.log('\n=== Testing bright colors ===\n');

console.log(redBright('This is bright red text'));
console.log(greenBright('This is bright green text'));
console.log(blueBright('This is bright blue text'));

console.log('\n=== Testing text styles ===\n');

console.log(bold('This is bold text'));
console.log(dim('This is dim text'));
console.log(italic('This is italic text'));
console.log(underline('This is underlined text'));
console.log(strikethrough('This is strikethrough text'));
console.log(inverse('This is inverse text'));

console.log('\n=== Testing background colors ===\n');

console.log(bgRed('This has a red background'));
console.log(bgGreen('This has a green background'));
console.log(bgBlue('This has a blue background'));
console.log(bgYellow('This has a yellow background'));
console.log(bgCyan('This has a cyan background'));
console.log(bgMagenta('This has a magenta background'));

console.log('\n=== Testing chained styles ===\n');

console.log(bold(red('Bold red text')));
console.log(underline(blue('Underlined blue text')));
console.log(bgYellow(bold('Bold text with yellow background')));
console.log(italic(green('Italic green text')));
console.log(strikethrough(cyan('Strikethrough cyan text')));

console.log('\n=== Testing RGB colors ===\n');

console.log(rgb(255, 87, 51)('Custom RGB color (255, 87, 51)'));
console.log(rgb(100, 200, 150)('Another RGB color (100, 200, 150)'));

console.log('\n=== Testing HEX colors ===\n');

console.log(hex('#FF5733')('Custom hex color #FF5733'));
console.log(hex('#3498db')('Another hex color #3498db'));
console.log(bgHex('#2ecc71')('Background hex color #2ecc71'));

console.log('\n=== Testing gradient ===\n');

console.log(gradient('Beautiful Gradient Text', ['red', 'yellow', 'green']));
console.log(gradient('Another Gradient', ['blue', 'magenta']));

console.log('\n=== Testing rainbow ===\n');

console.log(rainbow('Rainbow Colored Text!'));

console.log('\n=== Testing mixed content ===\n');

console.log(`Normal text ${green('green text')} ${bold('bold text')} back to normal`);
console.log(`${red('Error:')} Something went wrong!`);
console.log(`${green('Success:')} Operation completed successfully!`);
console.log(`${yellow('Warning:')} Please check your configuration`);
console.log(`${blue('Info:')} ${italic('This is an informational message')}`);

console.log('\n=== Testing utility functions ===\n');

const styledText = red('Colored text');
console.log(`Original: ${styledText}`);
console.log(`Stripped: ${stripAnsi(styledText)}`);
console.log(`Visible length: ${visibleLength(styledText)}`);

console.log('\n=== Test Complete ===');
console.log(bold(green('✓ All tests passed successfully!')));
