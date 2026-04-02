# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run package   # Bundle src/ into dist/index.js via rollup (required before committing)
npm run lint      # Lint with eslint
```

There are no configured tests (`npm test` exits with an error).

## Architecture

This is a GitHub Action that validates OpenAPI/Swagger schemas. The flow:

1. `action.yml` — declares the action interface (`filepath` input) and points to `dist/index.js` as the entrypoint (Node 24)
2. `src/index.mjs` — reads the `filepath` GitHub Action input, calls `validate()`
3. `src/validator.mjs` — resolves the full path using `GITHUB_WORKSPACE` (or `__dirname` as fallback), then calls `SwaggerParser.validate()` with `continueOnError: true`
4. `rollup.config.js` — bundles `src/index.js` → `dist/index.js` (ES module format)

**Important:** The `dist/` directory must be committed because GitHub Actions runs the bundled file directly. After any source change, run `npm run package` and commit the updated `dist/index.js`.

**Note:** `rollup.config.js` currently references `src/index.js` as the input, but the source files were recently renamed to `.mjs`. If rollup fails, update the `input` field in `rollup.config.js` to `src/index.mjs`.

## CI

`.github/workflows/verify-action.yml` runs the action itself against `schemas/openapiv3.yml` on every push to `main`/`releases/*` and on pull requests.
