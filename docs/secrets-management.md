# ARTHAX Secrets Management Guidelines

1. `.env.example` is the committed template. Real secrets live only in `.env`, which is git-ignored.
2. Never hardcode secrets, tokens, or connection strings in source files.
3. When adding a new environment variable, update `.env.example` with an empty value and a comment.
4. Rotate any secret that has ever been committed to Git history, even accidentally.
5. In production, inject secrets via the hosting platform's environment store — never bake them into images or bundles.

Validation: `pnpm env:check` scans tracked files for obvious leaked secrets (coming with Phase 2 auth work).
