# CLAUDE.md — Known Issues & Technical Debt

## Step Enforcement

### Issue 1 — `required` is UI-only; `next()` does not enforce it at the provider level

**File:** `src/components/TourProvider.tsx`, `next()` (~line 530)

The `next()` function in `TourProvider` only blocks progression when
`currentStepData.completed === false`. The `required` prop is enforced purely in
the default UI (`TourTooltip`) by hiding the skip button — it has no effect on
programmatic `next()` calls.

This means a consumer using a custom card can call `next()` directly on a step
where `required={true}` but no `completed` prop is provided, and the tour will
advance with no enforcement.

**Decision needed:** Should `required={true}` (with no `completed` prop) also
block `next()` at the provider level, or is it intentionally UI-only (i.e. just
a skip-button gate)? Whichever is chosen, document it clearly in the type
definitions and README.

---

### Issue 2 — No test coverage for step enforcement logic

**File:** `src/__tests__/index.test.tsx`

The file contains only `it.todo('write a test')`. The entire enforcement path —
`next()` blocking when `completed === false`, skip button visibility, next button
disabled state, and `completed` transitioning from `false` → `true` — has zero
automated test coverage.

**Tests to write:**

- `next()` is blocked when `completed === false`
- `next()` proceeds when `completed === true`
- `next()` proceeds when `completed === undefined` (no enforcement)
- Skip button is hidden when `required === true`
- Next button is visually disabled when `completed === false`
- Changing `completed` from `false` → `true` re-enables `next()`
