# ts-clean-code-node

TypeScript Clean Code starter project for Node.js, with strict typing, modern tooling, and enforced code quality out of the box.

## Prerequisites

| Tool    | Version    |
| ------- | ---------- |
| Node.js | >= 22.12.0 |
| pnpm    | >= 10.17.1 |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run the full check suite (types, lint, format, spelling)
pnpm run check

# Build the project
pnpm run build

# Run tests
pnpm test
```

## Scripts

| Command                  | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `pnpm run build`         | Clean `dist/`, compile with tsup, copy package files                               |
| `pnpm run check`         | Run all checks in parallel (types, lint, format, spelling, markdown, package.json) |
| `pnpm run fix`           | Auto-fix lint, format, and markdown issues                                         |
| `pnpm test`              | Run Jest test suite                                                                |
| `pnpm run test:coverage` | Run tests with coverage report                                                     |
| `pnpm run commit`        | Create a conventional commit via Commitizen                                        |
| `pnpm run version`       | Bump version and generate changelog with standard-version                          |
| `pnpm run update-deps`   | Check and update dependencies                                                      |

## Project Structure

```text
src/
├── index.ts          # Entry point
└── types/            # Custom type definitions
test/
├── jest.setup.ts     # Test setup (reflect-metadata)
└── unit/             # Unit tests
packages/             # Shared packages (placeholder)
docker/               # Dockerfile and docker-compose
.github/              # CI/CD workflows and templates
```

## Tooling

- **Build** — [tsup](https://tsup.egoist.dev) (powered by esbuild)
- **Lint** — [Biome](https://biomejs.dev)
- **Format** — [Prettier](https://prettier.io) + Biome
- **Test** — [Jest](https://jestjs.io) with ts-jest
- **Spell check** — [cspell](https://cspell.org)
- **Git hooks** — [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/lint-staged/lint-staged)
- **Commits** — [Commitizen](https://commitizen-tools.github.io/commitizen/) + [commitlint](https://commitlint.js.org) (conventional commits)
- **Versioning** — [standard-version](https://github.com/conventional-changelog/standard-version)

## TypeScript Configuration

The project uses two TypeScript configs:

- **`tsconfig.json`** — Full config with strict checks, used by the IDE and `tsc --noEmit`
- **`tsconfig.build.json`** — Extends the base config, used by tsup for production builds (excludes tests)

Decorators and `emitDecoratorMetadata` are enabled for decorator-based patterns (DI, ORM, etc.).

## License

ISC
