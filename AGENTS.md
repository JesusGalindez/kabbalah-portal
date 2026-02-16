Build/lint/test commands
- No build system detected yet; run `ls -a` to discover project files after checkout.
- If a package manager appears (e.g., `package.json`, `pyproject.toml`, `go.mod`), use its standard `test` target.
- Single-test guidance: use the framework’s CLI flags (e.g., Jest `-t`, Pytest `-k`, Go `-run`) once identified.

Architecture notes
- Repository currently empty in this workspace; no subprojects or internal APIs detected.
- Re-scan for `src/`, `apps/`, `packages/`, `services/`, or `db/` once files are present.
- Look for database configs in `migrations/`, `schema/`, or `docker-compose.yml` if added.

Code style guidelines
- Follow the project’s formatter and linter once discovered; prefer auto-formatting tools.
- Keep imports ordered and grouped by standard/library vs third-party vs local.
- Use clear, descriptive names; prefer explicit types where the language supports it.
- Handle errors explicitly; return or throw early on failures.
- Keep functions small and focused; avoid hidden side effects.

Rules and tool hints
- No Cursor/Claude/Windsurf/Cline/Goose/Copilot rules detected in this repository.
