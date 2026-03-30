import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    common: 'src/common/index.ts'
  },
  outDir: 'dist',
  format: ['esm', 'cjs'],
  tsconfig: 'tsconfig.build.json',
  platform: 'node',
  target: 'node22',
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  cjsInterop: true,
  // Dependencies stay external (tsup defaults + package.json deps)
  skipNodeModulesBundle: true
})
