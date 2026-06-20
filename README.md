# Student Loan Repayment Plan Estimator

A privacy-first, static SvelteKit foundation for the Student Loan Repayment Plan Estimator.

## Bootstrap stack

- SvelteKit with Svelte and TypeScript
- `@sveltejs/adapter-static` for prerendered GitHub Pages output
- npm with a committed `package-lock.json`
- Vitest for unit tests
- ESLint and Prettier for source validation and formatting

## Local setup

```bash
npm ci
npm run check
npm run lint
npm run test:unit
BASE_PATH=/Student-Loan-Planner npm run build
```

The `BASE_PATH` value should match the GitHub Pages repository path used for the deployment target.

## Codex setup

Agents can run the bootstrap setup script:

```bash
./scripts/codex-setup.sh
```

The script installs dependencies with `npm ci` and runs the Svelte/TypeScript check.
