import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const isProduction = process.env.NODE_ENV === 'production';

// Shared terser config for maximum minification
const terserConfig = {
  compress: {
    passes: 3,
    pure_getters: true,
    unsafe: true,
    unsafe_comps: true,
    unsafe_math: true,
    unsafe_proto: true,
  },
  mangle: {
    properties: {
      regex: /^_/,
    },
  },
  format: {
    comments: false,
  },
};

export default [
  // Main bundle - ESM
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
      }),
      isProduction && terser(terserConfig),
    ].filter(Boolean),
  },
  
  // Main bundle - CJS
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
      }),
      isProduction && terser(terserConfig),
    ].filter(Boolean),
  },

  // Core-only bundle (minimal)
  {
    input: 'src/core/index.ts',
    output: [
      { file: 'dist/core.mjs', format: 'esm' },
      { file: 'dist/core.cjs', format: 'cjs' },
    ],
    plugins: [
      typescript({ 
        tsconfig: './tsconfig.json', 
        declaration: false,
        declarationMap: false, 
      }),
      isProduction && terser(terserConfig),
    ].filter(Boolean),
  },

  // Gradient addon
  {
    input: 'src/advanced/gradient.ts',
    output: [
      { file: 'dist/gradient.mjs', format: 'esm' },
      { file: 'dist/gradient.cjs', format: 'cjs' },
    ],
    plugins: [
      typescript({ 
        tsconfig: './tsconfig.json', 
        declaration: false,
        declarationMap: false,
      }),
      isProduction && terser(terserConfig),
    ].filter(Boolean),
  },

  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
];