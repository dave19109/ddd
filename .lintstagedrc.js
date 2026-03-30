module.exports = {
  // TypeScript/JavaScript: Biome handles both formatting and linting.
  // Prettier is intentionally excluded for .ts/.js to avoid conflicts with Biome.
  '*.{js,ts}': [
    'prettier --check --write --ignore-unknown',
    'biome check --write',
    'cspell . --no-progress --no-color --no-summary',
    () => 'tsc -p tsconfig.build.json --pretty --noEmit'
  ],
  // Non-JS/TS files: Prettier handles formatting for formats Biome does not support.
  '!*.{js,ts,json}': ['prettier --check --write --ignore-unknown'],
  '*.{md,mdx}': ['markdownlint'],
  '{LICENSE,README.md,TODO.md,.github/**/*.md,src/**/*.ts}': ['cspell --gitignore'],
  'package.json': ['npmPkgJsonLint']
}
