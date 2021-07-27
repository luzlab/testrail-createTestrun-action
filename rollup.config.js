import merge from 'deepmerge';
import { createBasicConfig } from '@open-wc/building-rollup';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';


const baseConfig = createBasicConfig();

export default merge(baseConfig, {
  input: './src/uiscript.ts',
  plugins: [
    nodeResolve({modulesOnly: true, }),
    commonjs(),
    typescript({
      include: './src/uiscript.ts',
      tsconfig: 'tsconfig.uiscript.json',
    }),
  ],
  output: {
    dir: 'build',
    format: 'iife',
  },
});
