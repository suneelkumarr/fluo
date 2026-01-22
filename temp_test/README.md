# fluo-colors Test Project

This is a comprehensive test project for the `fluo-colors` package.

## Installation

The package has been installed using:
```bash
npm i fluo-colors
```

## Running the Tests

### Basic Test
To run the basic test file and see all the color outputs:

```bash
node test.js
```

### Advanced Features Demo
To run the advanced features demonstration:

```bash
node advanced-demo.js
```

### Comprehensive Feature Test
To test ALL features from the README:

```bash
node comprehensive-test.js
```

### Async Features Test
To test spinners, progress bars, and animations:

```bash
node async-features-test.js
```

## What's Being Tested

### test.js - Basic Features
The basic test file demonstrates:

- ✅ **Basic colors**: red, green, blue, yellow, cyan, magenta, white, black, gray
- ✅ **Bright colors**: redBright, greenBright, blueBright
- ✅ **Text styles**: bold, dim, italic, underline, strikethrough, inverse
- ✅ **Background colors**: bgRed, bgGreen, bgBlue, bgYellow, bgCyan, bgMagenta
- ✅ **Chained styles**: combining multiple effects (e.g., bold + red)
- ✅ **RGB colors**: Custom colors using RGB values
- ✅ **HEX colors**: Custom colors using hex codes
- ✅ **Gradients**: Multi-color gradients
- ✅ **Rainbow**: Rainbow text effect
- ✅ **Mixed content**: Colors within regular text
- ✅ **Utility functions**: stripAnsi, visibleLength

### advanced-demo.js - Advanced Features
The advanced demo showcases:

- ✅ **Fluo object chaining**: `fluo.bold.red.underline()`
- ✅ **Box feature**: Text in decorative boxes with padding options
- ✅ **Custom gradients**: Using hex color codes for gradients
- ✅ **Theme support**: Pre-defined themes for success, error, warning, info
- ✅ **Logger**: Structured logging with different levels

## Expected Output

You should see beautifully colored terminal output demonstrating all the features of the fluo-colors package, including:
- Colored text in various colors
- Styled text (bold, italic, underline, etc.)
- Background colors
- Custom RGB and HEX colors
- Gradient effects
- Rainbow effects
- Boxed text
- Themed messages

## Package Features Tested

This test project validates that `fluo-colors` is:
- ✅ Properly installed and importable
- ✅ All color functions work correctly
- ✅ Style functions work correctly
- ✅ Advanced features (gradients, rainbow, box) work correctly
- ✅ Utility functions work correctly
- ✅ Chaining and composition work correctly
