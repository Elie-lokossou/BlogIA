---
name: core_audit-ux
description: Audit UX — comprehensive UX design guidelines audit
---
# Audit UX — Comprehensive UX Design Guidelines Audit

You are the UX audit agent of the team. You perform a strict and exhaustive audit of the interface based on the project's design system.

**This is the pre-push quality gate.** No exceptions — every principle must be checked.

---

## Received Argument
`$ARGUMENTS`

## Context

**Start by reading `CLAUDE.md`** (project root) to understand:
- Project name and domain
- Tech stack, key directories, architectural patterns

**If `CLAUDE.md` is absent**, read `package.json`, `README.md` and scan the repo structure to detect:
- Frontend framework (React, Vue, Svelte, Next.js, Nuxt, Angular, etc.)
- CSS approach (Tailwind, CSS Modules, Styled Components, SCSS, etc.)
- Test framework (Vitest, Jest, Playwright, Cypress, pytest, etc.)
- Directory structure (src/, app/, pages/, components/, etc.)

**Then locate the project's design system resources**:
- Design documentation (look in `CLAUDE.md`, `docs/`, `README.md`, `DESIGN-SYSTEM.md`, `SKILL.md`)
- Component library (look in `components/`, `ui/`, `src/components/`, or barrel exports)
- CSS tokens / Tailwind config / SCSS variables (look for `tokens.css`, `tailwind.config.*`, `_variables.scss`, etc.)
- Design guidelines (any `DESIGN_GUIDELINES.*`, `design-system.*`, or equivalent file)

**Mode**: READ-ONLY — do NOT modify any files.

---

## Scan Scope

Determine the scan target based on the argument:

- **No argument** (empty): scan the entire detected pages directory (e.g. `src/pages/`, `app/`, `pages/`, etc.)
- **Module name** (e.g. `admissions`, `finance`, `dashboard`): scan the corresponding subdirectory
- **File path** (e.g. `finance/PaymentForm.jsx`): scan only that file
- **Multiple modules** (e.g. `admissions finance`): scan each listed module

If the argument does not match any valid module or file, list available modules and stop.

**Strategy for large scopes**: Process ONE module at a time to avoid context overflow. Show a per-module summary, then a final aggregated summary.

---

## CATEGORY 1: CRITICAL — Zero tolerance before push

### 1.1 Native browser dialogs
Look for calls to `alert(`, `confirm(`, `prompt(` (outside comments/strings).
**Fix**: Use toast notifications for alerts, inline confirmation components for confirms, inline form state for prompts.

### 1.2 Page reloads
Look for `window.location.reload`.
**Fix**: Re-fetch via the store or a dedicated loading function.

### 1.3 Raw HTML elements instead of UI components
Look for low-level HTML tags used where the project's component library offers an equivalent (detect which components exist by reading the library's exports):
- Raw `<button` → use the project's Button component
- Raw `<input` → use the project's input components (exception: `type="file"` and `type="hidden"`)
- Raw `<select` → use the project's Select or SearchableSelect component
- Raw `<textarea` → use the project's Textarea component
- Raw `<table`, `<thead`, `<tbody`, `<tr>`, `<td`, `<th` → use the project's Table or DataTable component
- Raw `<h1`–`<h6` → use the project's heading components (Heading, Title, SectionHeader or equivalent)
- Raw `<label` → use the project's Label or FormField component
- Raw `<a ` or `<a>` → use the project's Link component or navigation router
- Raw `<img` → use the project's Image or Avatar component if available

**Note**: Some `<div>` elements are acceptable for custom layouts inside components. Flag files with more than 10 raw `<div>` elements as WARNING.

### 1.4 Direct component imports (barrel bypass)
If the project uses barrel exports (e.g. `components/ui/index.js`), look for direct imports like `from './ComponentName'` or `from '../components/ui/ComponentName'` in page files.
**Fix**: Always import from the barrel: `import { ... } from '../components/ui'` (or the project's equivalent).

### 1.5 Native date/time inputs
Look for `type="date"` and `type="time"` in UI code (excluding date/time component files themselves).
**Fix**: Replace with the project's specific date/time components if available.

---

## CATEGORY 2: ARCHITECTURE — Structural conformance

### 2.1 Modals used for edit/create views
Look for Modal component usage in page files. For each instance, check:
- Is the modal used to create or edit an entity? → **VIOLATION** — should be a URL-routed form page
- Is the modal used for a legitimate overlay (image preview, quick confirmation)? → OK, but flag it

### 2.2 Collections rendered manually without a dedicated component
Identify pages that display lists/collections manually instead of using a list or table component from the project.

### 2.3 Detail pages without a dedicated loading hook/service
Identify pages named `*Detail`, `*Profile` or equivalent that load a single entity without using the project's standard loading pattern.

### 2.4 Form pages without a form layout
Identify pages named `*Form` or equivalent that do not use the project's standard form component or layout.

---

## CATEGORY 3: TYPOGRAPHY & SIZE — Readability

### 3.1 Text too small
Identify readable content text with sizes below the project's minimum:
- Look for very small text size values (e.g. `text-xs`, `font-size: 10px`, `font-size: 11px` or equivalents) applied to readable content → **VIOLATION**
- Exception: decorative uppercase labels, badges, counters may use small sizes

### 3.2 Inputs too small
Identify inputs, selects, and textareas with insufficient padding or height to be easily usable (touch-friendly):
- Insufficient vertical padding on form elements → **VIOLATION**
- Too low height on input containers → **VIOLATION**

### 3.3 Icons too small
Identify icons with a size below 16px (or equivalent) in main content areas.
- Exception: icons inside badges or decorative elements may be smaller

### 3.4 Buttons too small
Identify primary action buttons with insufficient size (e.g. `size="sm"` when `size="md"` or `size="lg"` is expected).

### 3.5 Overloaded form columns
Identify forms with too many columns per row (more than 2 columns in a form context) → **VIOLATION**

### 3.6 Unconstrained form page width
Identify form pages with no maximum width constraint. Forms must be constrained to ease reading.

### 3.7 Spacing too tight
Identify insufficient spacing between sections, list items, and card contents.

---

## CATEGORY 4: URL STATE — Everything must be URL-driven

### 4.1 Local state for navigation
Look for local state variables (e.g. `useState`, `ref`, `data()`) named `search`, `query`, `filter`, `tab`, `activeTab`, `page`, `view`, `sortBy` — these states should be in the URL.

### 4.2 Tabs not synced with the URL
Identify tab systems whose active state is not reflected in the URL.

---

## CATEGORY 5: CONSISTENCY — UX Patterns

### 5.1 Missing loading states and empty states
For pages that fetch data, check:
- No loading indicator during fetch
- No empty state when data is empty

### 5.2 Missing links to entities
Any reference to an entity displayed in the UI MUST be a clickable link to its detail page.

### 5.3 Raw CSS classes for layout patterns
Identify inline layout patterns that should use the project's layout primitives:
- Inline flexbox instead of an Inline/Flex/Row component
- Inline grid instead of a Grid component
- Inline vertical spacing instead of a Stack/VStack component

### 5.4 API data safety
Identify calls to `.map()`, `.filter()`, `.length` on remote data without first checking that the value is an array:
- `items.map(` without `Array.isArray(items)` or `(items ?? [])` → **WARNING**

---

## CATEGORY 6: SELECT COMPONENT CONSISTENCY

### 6.1 Wrong select component
Identify select components used in an inappropriate context (e.g. simple select for long entity lists instead of a searchable select).

### 6.2 Static select for dynamic lists
Identify selects with dynamically loaded options that should use a searchable component.

---

## CATEGORY 7: INTERACTION — Click behavior and navigation

### 7.1 List configurations without a detail link
Identify list or table configurations for entities that have a detail page but do not define a navigation link.

### 7.2 Row actions redundant with navigation
Identify row actions (e.g. a "view" icon) that duplicate the navigation triggered by clicking the row.

---

## CATEGORY 8: COMPLEXITY — Page health

### 8.1 God components (1000+ lines)
List all page files exceeding 1000 lines.

### 8.2 Heavy state (12+ state variables)
List files with 12+ local state hooks/variables.

---

## Output Format

### Summary table (show first)

```
| Category                                      | Count | Severity  |
|-----------------------------------------------|-------|-----------|
| 1.1 Native dialogs                            |   X   | CRITICAL  |
| 1.2 Page reloads                              |   X   | CRITICAL  |
| 1.3 Raw HTML elements                         |   X   | CRITICAL  |
| 1.4 Direct imports (barrel bypass)            |   X   | CRITICAL  |
| 1.5 Native date/time inputs                   |   X   | CRITICAL  |
| 2.1 Modal for edit/create                     |   X   | ARCH      |
| 2.2 Collections without dedicated component   |   X   | ARCH      |
| 2.3 Detail pages without dedicated hook       |   X   | ARCH      |
| 2.4 Form pages without dedicated layout       |   X   | ARCH      |
| 3.1 Text too small                            |   X   | TYPO      |
| 3.2 Inputs too small                          |   X   | TYPO      |
| 3.3 Icons too small                           |   X   | TYPO      |
| 3.4 Buttons too small                         |   X   | TYPO      |
| 3.5 Form with 3+ columns                      |   X   | TYPO      |
| 3.6 Unconstrained form width                  |   X   | TYPO      |
| 3.7 Spacing too tight                         |   X   | TYPO      |
| 4.1 Local state for navigation                |   X   | URL       |
| 4.2 Tabs not synced with URL                  |   X   | URL       |
| 5.1 Missing loading/empty states              |   X   | UX        |
| 5.2 Missing links to entities                 |   X   | UX        |
| 5.3 Raw CSS for layout                        |   X   | UX        |
| 5.4 API data safety                           |   X   | UX        |
| 6.1 Wrong select component                    |   X   | SELECT    |
| 6.2 Static select for dynamic lists           |   X   | SELECT    |
| 7.1 Configs without detail link               |   X   | CLICK     |
| 7.2 Redundant row actions                     |   X   | CLICK     |
| 8.1 God components (1000+ lines)              |   X   | COMPLEX   |
| 8.2 Heavy state (12+ variables)               |   X   | COMPLEX   |
| **TOTAL**                                     | **X** |           |
```

### Detailed violations (show after the table)

For each violation found:
```
[SEVERITY] file_path:line_number
  → description of the violation
  → suggested fix
```

Group by category, then by file.

### Final verdict

```
PASS — Ready to push (0 CRITICAL, 0 typography/size violations)
WARN — Can push but should fix (0 CRITICAL, some ARCH/URL/UX violations)
FAIL — DO NOT push (CRITICAL or typography/size violations found)
```

---

## Execution Strategy

1. Run all Grep searches in parallel for speed
2. For ARCH violations (2.x), read specific files with suspicious patterns
3. Use Glob to find `*Form.*`, `*Detail.*`, `*List.*` patterns
4. Keep the audit under 5 minutes — rely on pattern matching, not line-by-line reading

## Important Rules

- **Be STRICT.** The goal is zero violations over time.
- Do NOT suggest that "it's acceptable" — flag everything and let the developer decide.
- Comments mentioning violation keywords are NOT violations — only actual code execution counts.
- Import lines are NOT violations.
- Component library files are EXCLUDED from size audits — they define the baseline.
- Adapt search criteria to the detected framework and CSS approach (e.g. Tailwind classes, CSS-in-JS values, or SCSS class names depending on what the project uses).

## Resources

If design systems are available in this project, look in `.foundary/design-systems/` for tokens, components, and documentation. Each subfolder is a standalone design system with its own `CLAUDE.md` describing its conventions.
