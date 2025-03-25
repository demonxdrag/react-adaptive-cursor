import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts', // Main entry file
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs', // CommonJS
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm', // ESM
    }
  ],
  plugins: [resolve(), commonjs(), typescript()],
  external: ['react', 'react-dom'] // Ensures React is not bundled
};
