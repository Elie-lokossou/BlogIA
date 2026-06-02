---
name: core_git-push
description: Git Push — safe push pipeline with checks
---
# Git Push — Safe Push Pipeline

Runs the full quality pipeline before pushing to the remote. Stops at the first error.

## Pipeline

```
Tests → Security Audit → Update Docs → Local CI → Git Push → Watch Deploy
```

## Received Argument

`$ARGUMENTS`

## Context

**Start by reading `CLAUDE.md`** (project root).
**If absent**, detect from `package.json`, `README.md`, and the repo structure:

- Package manager: pnpm / npm / yarn / bun / pip / go modules / cargo / etc.
- Runtime / language: Node.js, Python, Go, Rust, Ruby, etc.
- Backend / frontend framework
- CI/CD tool: GitHub Actions (`.github/workflows/`), GitLab CI (`.gitlab-ci.yml`), CircleCI (`.circleci/config.yml`), Bitbucket Pipelines, Jenkins, etc.
- Makefile present? (`Makefile` or `makefile`)
- Monorepo structure? (multiple `package.json`, workspaces, `apps/`, `packages/`, `server/`)

**Detecting test commands:**

```bash
# Read available scripts (Node.js)
cat package.json 2>/dev/null | grep -A 30 '"scripts"'

# Monorepo: read each workspace package.json
find . -name "package.json" -not -path "*/node_modules/*" -maxdepth 3 2>/dev/null

# Python
cat pyproject.toml 2>/dev/null | grep -A 10 '\[tool.pytest\]\|\[tool.ruff\]'
cat setup.py 2>/dev/null | head -20

# Go
cat Makefile 2>/dev/null | grep "test"

# Rust
cat Cargo.toml 2>/dev/null | grep "test"

# Makefile (all stacks)
cat Makefile 2>/dev/null | grep "^[a-z].*test\|^[a-z].*ci\|^[a-z].*lint" | cut -d: -f1
```

## Instructions

Execute each step sequentially. **Stop immediately** if a step fails, report the failure, and do NOT continue to the next step.

### Step 1: Run Tests

Derive test commands from the detected stack. Examples by stack:

**Node.js / JavaScript / TypeScript:**
```bash
# Read scripts from the root package.json
# Run the "test" script if it exists
pnpm run test 2>&1   # or npm/yarn/bun depending on the detected lock file
```

If the project is a **monorepo** (workspaces, `server/`, `client/`, `apps/` folders):
```bash
# Run tests for each workspace separately
# Detect workspaces from package.json or the folder structure
# Adapt the command to each workspace
```

**Python:**
```bash
pytest 2>&1          # or python -m pytest
# or: python -m unittest discover
```

**Go:**
```bash
go test ./... 2>&1
```

**Rust:**
```bash
cargo test 2>&1
```

**Makefile (if present and a `test` or `ci` target exists):**
```bash
make test 2>&1       # or make ci / make check depending on available targets
```

If no test command is detected, report it and move to the next step.

If a test fails → **STOP**. Report which tests failed and propose fixes. Do NOT continue.

### Step 2: Security Audit

Run the `/cybersec audit` skill to check for vulnerabilities in the code being pushed.

Covers: dependency vulnerabilities (per the detected package manager), secret detection (keys, tokens, passwords in code), OWASP top 10 checks on modified files.

If critical or high vulnerabilities are found → **STOP**. Report the findings and propose fixes. Do NOT continue.
Low/moderate findings are reported as warnings but do NOT block the pipeline.

### Step 3: Update Documentation

Run the `/update-docs` skill to sync documentation with recent code changes.

If doc updates produce file changes, stage and commit them with the message: `docs: update documentation before push`

### Step 4: Local CI Pipeline

Check if a Makefile or local CI command exists and run it:

```bash
# Check available CI targets in the Makefile
cat Makefile 2>/dev/null | grep "^[a-z].*ci\|^[a-z].*check\|^[a-z].*lint\|^[a-z].*build" | cut -d: -f1
```

If a local CI target is detected (e.g. `make ci`, `make ci-quick`, `make check`):
```bash
make <detected-target> 2>&1
```

If no Makefile, build an equivalent check from the detected scripts:
- Lint (if a `lint` script is present in package.json or equivalent)
- Build (if a `build` script is present)
- Type check (if a `typecheck` / `tsc` script is present)

If the local CI fails → **STOP**. Report the failure. Do NOT push.

### Step 5: Git Push

All gates passed. Push to the remote:

```bash
git push
```

If the push fails (e.g. rejected, no upstream), report the error and suggest a fix (e.g. `git push -u origin <branch>`).

### Step 6: Watch Deploy

After a successful push to the main branch, monitor the deployment pipeline per the detected CI/CD:

**GitHub Actions (if `.github/workflows/` detected and `gh` CLI available):**
```bash
sleep 5
RUN_ID=$(gh run list --limit 1 --json databaseId -q '.[0].databaseId')
echo "Watching deploy run $RUN_ID..."
gh run watch $RUN_ID --exit-status
```

**GitLab CI (if `.gitlab-ci.yml` detected and `glab` CLI available):**
```bash
glab ci list --limit 1
# Follow the most recent pipeline
```

**Vercel (if `vercel.json` or `.vercel/` detected):**
```bash
vercel ls --limit 1
```

**Fly.io (if `fly.toml` detected):**
```bash
fly status
fly logs --no-tail
```

**If no CI/CD tool detected**: simply confirm that the push succeeded.

Report the result:
- **Success**: "Deploy successful — <production-url> is live"
- **Failure**: Show the failing step and the last available log lines

Note: Run the watch command in the background (`run_in_background: true`). The user will be notified when it completes.

## Summary

After completion (success or failure), display a pipeline summary:

```
Pipeline Results:
  [1] Tests          OK / FAIL / SKIP (no tests detected)
  [2] Security Audit OK / WARN / FAIL / SKIP
  [3] Update Docs    OK / FAIL / SKIP
  [4] Local CI       OK / FAIL / SKIP
  [5] Git Push       OK / FAIL / SKIP
  [6] Deploy         WATCHING / OK / FAIL / SKIP (no CI detected)
```

If everything passed: confirm the push with the branch name and remote.
If a step failed: indicate which one and what needs to be fixed.

## Resources

If design systems are available in this project, look in `.foundary/design-systems/` for tokens, components, and documentation. Each subfolder is a standalone design system with its own `CLAUDE.md` describing its conventions.
