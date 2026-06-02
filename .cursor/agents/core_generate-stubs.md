---
name: core_generate-stubs
description: Generate Demo Stubs — realistic placeholder data and mocks
---
# Generate Demo Stubs

Generate realistic demo data so every page of the app has content. You do NOT write a static script — you dynamically read the current schemas and populate data via the API or the database CLI.

## Argument received

`$ARGUMENTS`

## Context

**Start by reading `CLAUDE.md`** (project root).
**If missing**, detect from `package.json`, `README.md` and the repo structure:

- Package manager: pnpm / npm / yarn / bun / pip / go modules / cargo / etc.
- Runtime / language: Node.js, Python, Go, Rust, etc.
- Backend / frontend framework
- **Data layer**: MongoDB, PostgreSQL, MySQL, SQLite, Supabase, Prisma, Drizzle, TypeORM, ActiveRecord, etc.
- Dev server port: detect from `.env.example`, `CLAUDE.md`, or framework config files
- Auth method: Bearer token, session cookie, API key, etc.

## How it works

1. **Phase 0: Detect the data layer** — identify the DB and ORM/client used
2. **Phase 1: Read current data models** — scan schema/model files to understand required fields, enums, relations
3. **Phase 2: Check what is already populated** — adapt the check command to the detected DB
4. **Phase 3: Generate only what is missing** — do not overwrite existing data
5. **Every record MUST have a stub marker** (see below by DB) — so stubs can be cleaned up later
6. **Use the REST API if available** — otherwise direct DB insertion or seed script

## Phase 0: Detect the data layer

```bash
# Detect DB from CLAUDE.md or dependencies
cat CLAUDE.md 2>/dev/null | grep -i "mongo\|postgres\|mysql\|sqlite\|supabase\|prisma\|drizzle"

# Node.js dependencies
cat package.json 2>/dev/null | grep -i "mongoose\|mongodb\|pg\|mysql\|sqlite\|prisma\|drizzle\|supabase"

# Python
cat requirements.txt pyproject.toml 2>/dev/null | grep -i "psycopg\|pymongo\|sqlalchemy\|django\|peewee"

# ORM config files
ls prisma/schema.prisma drizzle.config.ts drizzle.config.js 2>/dev/null
ls server/prisma/schema.prisma 2>/dev/null

# .env.example for connection URL
find . -name ".env.example" -not -path "*/node_modules/*" | xargs grep -i "database_url\|mongo_uri\|db_url\|postgres\|mysql" 2>/dev/null
```

**Stub marker by detected DB:**

| DB / ORM | Stub marker | Cleanup |
|---|---|---|
| MongoDB / Mongoose | `_isStub: true` | `deleteMany({ _isStub: true })` |
| PostgreSQL / MySQL / SQLite | Column `is_stub BOOLEAN DEFAULT false` | `DELETE FROM table WHERE is_stub = true` |
| Prisma | Field `isStub Boolean @default(false)` | `prisma.table.deleteMany({ where: { isStub: true } })` |
| Supabase | Column `is_stub` in each table | `supabase.from('table').delete().eq('is_stub', true)` |
| Any ORM | Adapt to existing schema | Adapt the cleanup query |

## Phase 1: Read schemas / models

```bash
# MongoDB / Mongoose — find model files
find . -path "*/models/*.js" -o -path "*/models/*.ts" -not -path "*/node_modules/*" 2>/dev/null

# Prisma
cat prisma/schema.prisma 2>/dev/null
cat server/prisma/schema.prisma 2>/dev/null

# Drizzle
find . -name "*.schema.ts" -o -name "schema.ts" -not -path "*/node_modules/*" 2>/dev/null

# Django / SQLAlchemy / ActiveRecord — find models
find . -name "models.py" -o -path "*/models/*.py" 2>/dev/null

# TypeORM — entities
find . -path "*/entities/*.ts" -not -path "*/node_modules/*" 2>/dev/null
```

For each schema found, read the file to identify:
- Required vs optional fields
- Enums and valid values
- Relations / foreign keys (create parents first)

## Phase 2: Check what is already populated

Adapt the check command to the detected DB:

**MongoDB:**
```bash
# Detect connection URL from .env.example or CLAUDE.md
mongosh "<detected-connection-string>" --quiet --eval '
  const colls = db.getCollectionNames().sort();
  colls.forEach(c => {
    const count = db[c].countDocuments();
    print(`${count === 0 ? "EMPTY" : "OK   "} ${c}: ${count}`);
  });
'
```

**PostgreSQL:**
```bash
# Detect connection string from .env.example
psql "<detected-DATABASE_URL>" -c "
  SELECT schemaname, tablename,
    (SELECT count(*) FROM information_schema.tables t2
     WHERE t2.table_name = t.tablename) as row_count
  FROM information_schema.tables t
  WHERE table_schema = 'public'
  ORDER BY tablename;
"
# Alternative: check via the detected ORM
```

**Prisma:**
```bash
# Via Prisma Studio (interactive) or seed script
npx prisma studio
# or check via the existing seed script
cat prisma/seed.ts prisma/seed.js 2>/dev/null
```

**SQLite:**
```bash
# Detect .db file from CLAUDE.md or .env.example
sqlite3 "<detected-db-file>" ".tables"
sqlite3 "<detected-db-file>" "SELECT name, (SELECT count(*) FROM pragma_table_info(name)) FROM sqlite_master WHERE type='table';"
```

**Supabase:**
```bash
# Via Supabase CLI if installed
supabase db status
# or via the Supabase REST API
```

## Generation methods

### Option A: REST API (preferred if POST routes exist)

```bash
# Detect base URL and port from CLAUDE.md or .env.example
BASE_URL=$(grep -i "api_url\|base_url\|server_url\|port" .env.example 2>/dev/null | head -1)
# If not found, look in CLAUDE.md

# Detect auth method from CLAUDE.md
# Examples by detected auth:

# Bearer token (if dev-token endpoint detected in CLAUDE.md)
TOKEN=$(curl -s "<detected-auth-endpoint>" 2>/dev/null | jq -r '.token')

# API key (if detected in .env.example)
# Adapt the header to the project's auth method

# Create a record
curl -X POST "<detected-base-url>/api/<resource>" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Demo Item","status":"active","_isStub":true}'
  # Adapt the stub marker to the detected DB
```

### Option B: Project seed script (if one exists)

```bash
# Check if the project already has a seed script
cat package.json 2>/dev/null | grep -i "seed"
ls prisma/seed.* db/seeds/ seeds/ scripts/seed* 2>/dev/null

# If a seed script exists, use or extend it
pnpm run seed      # or npm/yarn/bun depending on the package manager
npx prisma db seed # if Prisma detected
python manage.py loaddata fixtures/ # if Django detected
```

### Option C: Direct DB insertion

Depending on the detected DB, adapt the insertion method. Always include the appropriate stub marker (see Phase 0 table). Create parents before children (respect relations).

### Option D: Server-side one-liner script (Node.js ES modules, if applicable)

```bash
# Only if the project uses Node.js and models are accessible
# Detect the DB entry point from CLAUDE.md
cd <detected-server-dir> && node -e "
  import('<detected-db-config>').then(m => m.default()).then(async () => {
    const Model = (await import('<detected-model-path>')).default;
    await Model.create({ name: 'Demo', status: 'active', _isStub: true });
    process.exit(0);
  });
"
```

## Step by step

### Step 1: Discover what is empty

Run the check command adapted to the detected DB (see Phase 2 above).

### Step 2: Read schemas for empty collections/tables

For each empty collection/table, read the corresponding model file to:
- Identify required fields, enums, refs
- Check if a POST API route exists

### Step 3: Generate consistent data

**Order matters — create parents before children:**

1. **Independent entities** (no refs): Categories, Settings, Roles, Tags
2. **First-level refs**: Items referencing independent entities
3. **Second-level refs**: Records referencing first-level items
4. **Deep refs**: Records referencing multiple levels

**Use realistic but generic demo data:**
- Names: Alex Smith, Jordan Lee, Morgan Chen, Sam Taylor, Riley Johnson
- Emails: alex.demo@example.com, jordan.demo@example.com
- Phone: +1 555-XXX-XXXX
- Dates: within the last 6–12 months
- Amounts: round numbers suited to the domain (100, 500, 1000, 2500)
- Cities: New York, London, Paris, Tokyo, Sydney (adapt to project context)
- Companies: Acme Corp, Globex, Initech, Umbrella Ltd, Stark Industries

### Step 4: Populate via the chosen method

Always include the stub marker appropriate to the detected DB.

### Step 5: Verify

After populating, re-run the count check (Phase 2) to confirm all collections/tables have data.

## Cleanup command

Adapt to the detected DB. Examples:

**MongoDB:**
```bash
mongosh "<detected-connection-string>" --eval '
  const colls = db.getCollectionNames();
  colls.forEach(c => {
    const result = db[c].deleteMany({ _isStub: true });
    if (result.deletedCount > 0) print(`${c}: ${result.deletedCount} stubs deleted`);
  });
'
```

**PostgreSQL / SQL:**
```sql
-- Generate DELETE statements for each table that has an is_stub column
-- Adapt to each detected table
DELETE FROM <table> WHERE is_stub = true;
```

**Prisma:**
```typescript
// Adapt to each detected model
await prisma.<model>.deleteMany({ where: { isStub: true } });
```

## Minimums by table/collection type

| Type | Min records | Key fields to fill |
|---|---|---|
| Users / Contacts | 10 | name, email, role/type, status |
| Main entities | 5–10 | name, status, dates, refs |
| Transaction records | 10–20 | entityId, amount/value, date, status |
| Settings / Config | 3–5 | key, value, type |
| Log / History | 10 | entityId, action, timestamp |
| Tags / Categories | 5–10 | name, color/type |

## Important

- **NEVER delete non-stub data** — only records with the stub marker
- **Read the actual schema** before generating — do not assume field names
- **Use real IDs/refs** from created records — no fake IDs
- **Check the API response** after creation to confirm success
- **The stub marker** may have `select: false` or equivalent in some ORMs — it will not be visible in GET responses, but IS stored in the DB for cleanup queries
- **Adapt every command** to the stack actually detected — do not assume MongoDB or Node.js

## Resources

If design systems are available in this project, look in `.foundary/design-systems/` for tokens, components, and documentation. Each subfolder is a standalone design system with its own `CLAUDE.md` describing its conventions.
