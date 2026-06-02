---
name: core_update-docs
description: Update Documentation — keep docs in sync with code
---
# Update Documentation

Analyze recent git commits and update the documentation to reflect code changes.

## Received Argument

`$ARGUMENTS`

## Context

**Start by reading `CLAUDE.md`** (project root).
**If absent**, detect from `package.json`, `README.md`, and the repo structure:

- Package manager: pnpm / npm / yarn / bun / pip / go modules / cargo / etc.
- Runtime / language: Node.js, Python, Go, Rust, Ruby, etc.
- Backend / frontend framework
- **Data layer**: MongoDB, PostgreSQL, MySQL, SQLite, Supabase, Prisma, etc.
- Documentation structure: `docs/`, `wiki/`, `README.md`, `.claude/`, etc.
- Code languages present: `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.go`, `.rs`, `.rb`, etc.

## Phase 0: Scan the Real Project Structure

Before making any changes, discover what actually exists.

### Documentation discovery

```bash
# Scan the documentation structure
find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*" | sort

# Docs in a dedicated folder
ls docs/ wiki/ .claude/ 2>/dev/null

# README at root and in subfolders
find . -name "README.md" -not -path "*/node_modules/*" -maxdepth 4 | sort

# Claude config files
ls .claude/commands/ .claude/agents/ 2>/dev/null

# Landing page data (static JSON/TS data files)
find . -name "*.json" -not -path "*/node_modules/*" -path "*/data/*" | head -20
find src -name "*data*" -o -name "*config*" 2>/dev/null | grep -v node_modules | head -20
```

### Code language discovery

```bash
# Detect file extensions present in the project (excluding node_modules)
find . -not -path "*/node_modules/*" -not -path "*/.git/*" -type f \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \
     -o -name "*.py" -o -name "*.go" -o -name "*.rs" -o -name "*.rb" \
     -o -name "*.java" -o -name "*.php" \) \
  | sed 's/.*\.//' | sort | uniq -c | sort -rn
```

### Data layer discovery

```bash
# Detect DB / ORM from dependencies or CLAUDE.md
cat package.json 2>/dev/null | grep -i "mongoose\|mongodb\|pg\|mysql\|sqlite\|prisma\|drizzle\|supabase"
cat requirements.txt pyproject.toml 2>/dev/null | grep -i "psycopg\|pymongo\|sqlalchemy\|django"
ls prisma/schema.prisma 2>/dev/null

# Locate models / schemas
find . -not -path "*/node_modules/*" \
  \( -path "*/models/*.ts" -o -path "*/models/*.js" -o -path "*/models/*.py" \
     -o -name "schema.prisma" -o -path "*/entities/*.ts" \) 2>/dev/null | sort
```

## Instructions

1. Run `git log --oneline -30` to see recent changes
2. For each significant change, identify the affected docs (see mapping below)
3. Run the **Feature Status Verification** (see dedicated section)
4. Read the affected doc files (discovered in Phase 0)
5. Update them to reflect the current state
6. Summarize all changes made

## Commit → affected docs mapping

Dynamically derive docs from Phase 0:

- New routes/endpoints → project structure docs + contribution guide (API docs are auto-generated — no manual route inventory)
- New components → design guidelines
- New env variables → `.env.example` + deployment docs
- New Makefile targets → Makefile + onboarding guide (if Makefile detected)
- New Claude commands → Claude commands docs (if `.claude/commands/` detected)
- New features / modules → landing page data files (if the project has a landing page)

**Always map to real paths discovered in Phase 0, never to assumed paths.**

## Feature Status Verification (MANDATORY)

Features marked as planned or on the roadmap are often shipped without doc updates. **Verify each planned item** in the real code before finishing.

### Step 1: Extract all planned / roadmap items

```bash
# Search in doc files discovered in Phase 0
grep -r -i "planned\|roadmap\|coming soon\|todo" \
  $(find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/.git/*") 2>/dev/null

# Landing page JSON data files (if detected)
find . -name "*.json" -not -path "*/node_modules/*" -path "*/data/*" \
  | xargs grep -l "planned\|roadmap\|status" 2>/dev/null

# Dedicated backlog / roadmap
find . -name "BACKLOG.md" -o -name "ROADMAP.md" -o -name "TODO.md" \
  -not -path "*/node_modules/*" 2>/dev/null | xargs grep -i "open\|planned" 2>/dev/null
```

### Step 2: For EACH item, search for evidence in the code

For each planned item, derive search keywords and verify in the real code:

```bash
# Adapt paths to real folders detected in Phase 0

# Routes (most reliable — if a route exists, it's shipped)
grep -r -i "<keyword>" --include="*.ts" --include="*.js" --include="*.py" \
  $(find . -name "*route*" -o -name "*router*" -not -path "*/node_modules/*") 2>/dev/null

# Pages / views
find . -not -path "*/node_modules/*" -iname "*<keyword>*" \
  \( -name "*.tsx" -o -name "*.jsx" -o -name "*.vue" -o -name "*.svelte" -o -name "*.py" \) 2>/dev/null

# Navigation / sidebar components
grep -r -i "<keyword>" \
  $(find . -not -path "*/node_modules/*" \( -name "*nav*" -o -name "*sidebar*" -o -name "*menu*" \)) 2>/dev/null

# Backend models / schemas
find . -not -path "*/node_modules/*" -iname "*<keyword>*" \
  \( -name "*.ts" -o -name "*.js" -o -name "*.py" \) \
  -path "*/models/*" -o -path "*/entities/*" -o -path "*/schemas/*" 2>/dev/null
```

**Do not just check if a file exists — open it briefly to confirm it is a real implementation, not a stub or placeholder.**

### Step 3: Update the relevant docs / data files

For each item found in the code:
- Mark it as shipped / in production in the relevant docs
- Remove it from the roadmap if it is complete
- Update counters and status flags

### Step 4: Cross-reference recent commits with release notes

1. Run `git log --oneline -30` to see recent commits
2. Extract each `feat:` or `feat(...)` commit — these are new features
3. For each feature commit, check whether it is mentioned in the latest release notes
4. If a shipped feature is missing from the release notes, add it

## Landing Page Audit (if the project has a landing page)

Read `CLAUDE.md` to find landing page data file paths. Discover them if absent:

```bash
# Search for static data files
find . -not -path "*/node_modules/*" \
  \( -name "*landing*" -o -name "*home*" -o -name "*features*" \) \
  \( -name "*.json" -o -name "*.ts" -o -name "*.js" \) 2>/dev/null | head -10
```

### Stats to refresh

```bash
# Commits
git log --oneline | wc -l

# Lines of code — adapt extensions to languages detected in Phase 0
# Example for TypeScript + JavaScript:
find . -not -path "*/node_modules/*" -not -path "*/.git/*" \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  | xargs wc -l 2>/dev/null | tail -1

# For Python:
find . -not -path "*/node_modules/*" -name "*.py" | xargs wc -l 2>/dev/null | tail -1

# For Go:
find . -not -path "*/node_modules/*" -name "*.go" | xargs wc -l 2>/dev/null | tail -1

# Days since first commit
python3 -c "
import subprocess
from datetime import datetime
log = subprocess.run(['git', 'log', '--format=%ai', '--reverse'], capture_output=True, text=True).stdout
first = log.strip().split('\n')[0][:10]
d1 = datetime.strptime(first, '%Y-%m-%d')
print((datetime.today() - d1).days)
"

# Model / schema files — adapt to detected path
find . -not -path "*/node_modules/*" \
  \( -path "*/models/*.ts" -o -path "*/models/*.py" -o -name "schema.prisma" \) \
  2>/dev/null | wc -l

# Claude commands (if .claude/commands/ detected)
ls .claude/commands/*.md 2>/dev/null | wc -l
```

Fields to update in landing data files (based on what exists in the project):
- `meta.lastUpdated` → today's date
- Stat values (LOC, commits, days, models, API routes)
- Release notes → add a new release if significant work has shipped
- Roadmap → mark completed items, remove finished ones

## Quick Verification Stats

Run when docs are suspected to be outdated. Adapt each command to the real paths and languages in the project (discovered in Phase 0):

```bash
echo "=== COMMITS ===" && git log --oneline | wc -l

echo "=== LOC ===" && find . -not -path "*/node_modules/*" -not -path "*/.git/*" \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \
     -o -name "*.py" -o -name "*.go" -o -name "*.rs" \) \
  | xargs wc -l 2>/dev/null | tail -1

echo "=== SCHEMAS ===" && find . -not -path "*/node_modules/*" \
  \( -path "*/models/*.ts" -o -path "*/models/*.py" -o -name "schema.prisma" \) \
  2>/dev/null | wc -l

echo "=== DAYS ===" && python3 -c "
import subprocess
from datetime import datetime
log = subprocess.run(['git', 'log', '--format=%ai', '--reverse'], capture_output=True, text=True).stdout
first = log.strip().split('\n')[0][:10]
d1 = datetime.strptime(first, '%Y-%m-%d')
print((datetime.today() - d1).days)
"

echo "=== DOCS FILES ===" && find . -name "*.md" \
  -not -path "*/node_modules/*" -not -path "*/.git/*" | wc -l

echo "=== CLAUDE COMMANDS ===" && ls .claude/commands/*.md 2>/dev/null | wc -l || echo "N/A"
```

Then compare with the landing page data files and documentation.

## Important Rules

- **Always map to real paths** — never assume `docs/architecture/DESIGN_GUIDELINES.md` or any fixed path
- **Adapt file extensions** to the languages actually present in the project
- **Adapt the DB CLI** to the detected DB (`psql`, `mongosh`, `sqlite3`, `supabase`, etc.)
- **Only update files that exist** — do not create docs the project does not have
- Clearly summarize the changes made at the end

## Resources

If design systems are available in this project, look in `.foundary/design-systems/` for tokens, components, and documentation. Each subfolder is a standalone design system with its own `CLAUDE.md` describing its conventions.
