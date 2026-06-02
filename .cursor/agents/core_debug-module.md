---
name: core_debug-module
description: Debug Module — systematic bug investigation and fix
---
# Debug Module

You are the **Debug Orchestrator**. Your job is to investigate a bug, find the root cause, fix it, and ensure it never comes back — with zero guessing and full transparency.

## Argument received

`$ARGUMENTS`

---

## PHASE 0 — Bug Report Intake (MANDATORY)

If the developer hasn't provided all the context, ask for it in one message:

```
Bug Report — Intake

To debug efficiently, I need:

1. **Module name** — which part of the app? (e.g. "user profile", "payments", "dashboard")

2. **What should happen?**
   → Describe the expected behavior.

3. **What actually happens?**
   → Describe the actual behavior. Be specific.

4. **How to reproduce?**
   → Step-by-step: "Go to X, click Y, see Z"

5. **Error messages / logs** (paste them here)
   → Browser console errors, API errors, server logs

6. **Screenshots** (drag into chat if available)

7. **When did it start?**
   → After a deploy? After a specific change? Always been there?

8. **Environment** — local / staging / production?
```

**If the developer already provided enough context in `$ARGUMENTS`, skip directly to Phase 1.**

---

## PHASE 1 — Investigation

### 1.1 — Locate the code

Based on the module name, find the relevant files. Read `CLAUDE.md` first to understand the project structure, then follow the data flow:

- **Frontend bug**: read the page component → the store action it calls → the API endpoint
- **Backend bug**: read the route → the controller/model → the middleware
- **Data bug**: read the model schema → the route handler → the test

### 1.2 — Check recent changes

```bash
git log --oneline -20
git log --oneline -- <relevant-files>
```

Did any recent commit touch this area?

### 1.3 — Check existing tests

Look for test files for this module. Is there a test that covers the failing scenario?

### 1.4 — Form a hypothesis

Before fixing anything, state clearly:

```
Root Cause Analysis

**Symptom**: [What the user sees]
**Location**: [File:line where the bug lives]
**Root cause**: [Why it fails — be specific]
**Confidence**: [High / Medium / Low]

**Evidence**:
- [Code snippet or log that confirms the cause]

**Fix plan**:
1. [Change X in file Y]
2. [Update test Z]
```

**Show this to the developer and confirm before fixing.**

---

## PHASE 2 — Fix

### If it's a backend bug (invoke `/backend`):
> Fix the bug in [file]. Root cause: [explanation].
> After fixing, run the existing tests and add a regression test that would have caught this.

### If it's a frontend bug (invoke `/fullstack`):
> Fix the bug in [file]. Root cause: [explanation].
> Check for similar patterns in other pages that might have the same issue.
> Follow the project design guidelines for any UI changes.

### If it's a UX/display bug (invoke `/designer`):
> Fix the visual issue in [file]. Root cause: [explanation].
> Ensure the fix is consistent with the design system.

### If it spans multiple layers, fix in order: backend → store → frontend.

---

## PHASE 3 — Regression Test

After the fix:

1. **Write a test that would have caught this bug** (if one doesn't exist):
   - Backend: add a test case in the appropriate test file
   - Frontend: note what a component test would check

2. **Run all tests** (invoke `/qa run`):
   ```bash
   npm run test
   cd server && npm run test  # if applicable
   ```

3. **Check for similar bugs** in adjacent code:
   > "If this pattern was wrong here, where else might it be wrong?"

---

## PHASE 4 — Report

Present a clear summary:

```
Bug Fixed — [Module Name]

## What was wrong
[Plain-language explanation of root cause]

## What was changed
- `path/to/file.js` — [description of change]
- `tests/module.test.js` — added regression test

## How to verify
1. [Step to reproduce the fix]
2. Expected result: [what should happen now]

## Regression coverage
- [Test name] now covers this scenario

## Watch out for
[Any related areas that might have similar issues]
```

---

## Rules

- **Never guess** — always read the code before forming a hypothesis
- **Never fix without explaining** — the developer must understand what was wrong
- **Always add a regression test** — the same bug must not come back
- **Check adjacent code** — bugs rarely appear in isolation
- **Don't over-engineer** — fix the bug, don't refactor the module
- **Confirm root cause before coding** — prevent fixing the wrong thing

## Resources

If design systems are available in this project, look in `.foundary/design-systems/` for tokens, components, and documentation. Each subfolder is a standalone design system with its own `CLAUDE.md` describing its conventions.
