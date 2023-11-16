import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig([
  {
    entries: ['src/index'],
    declaration: false,
    clean: true,
    failOnWarn: false,
    rollup: {
      emitCJS: true,
      esbuild: {
        // minify: true
      }
    }
  }
]);
