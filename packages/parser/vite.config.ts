import { createViteConfig } from '@vtj/cli';
export default createViteConfig({
  lib: true,
  dts: true,
  version: true,
  formats: ['es', 'cjs'],
  external: [
    '@vtj/base',
    '@vtj/core',
    '@vue/compiler-sfc',
    '@vue/compiler-dom',
    '@babel/parser'
  ]
});
