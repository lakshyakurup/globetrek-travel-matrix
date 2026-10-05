# Engineering standards

- Use strict TypeScript and explicit Python type annotations.
- Keep domain logic pure where possible and make I/O boundaries injectable.
- Validate all external input, use structured errors, and never log credentials or payment payloads.
- Prefer small modules with tests for algorithms, authorization, and concurrency behavior.
- Use accessible labels, keyboard interactions, and server-compatible React components.
- Run `npx tsc --noEmit`, `npm run lint`, `npm run build`, and relevant test suites before opening a pull request.

Commit messages follow Conventional Commits: `type(scope): imperative summary`. Use `feat` for capabilities, `fix` for corrections, `test` for test-only changes, `docs` for documentation, and `chore` for maintenance.
