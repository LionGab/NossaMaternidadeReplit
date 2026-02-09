# Plan: Workspace Cleanup & Optimization

**Date**: 2026-01-29
**Branch**: `feature/workspace-cleanup`
**Status**: ✅ Repository Already Clean - Minor Optimizations Needed

---

## Executive Summary

**Good News**: After thorough exploration, the repository is **already clean and well-organized**. No massive duplication found (`NossaMaternidade/NossaMaternidade` doesn't exist), no temporary folders (`tmpclaude-*`), no old backups.

**What's Needed**:

1. Remove one temporary cache: `supabase/.temp` (safe, auto-regenerates)
2. Add version/date stamp to root `CLAUDE.md` (currently missing)
3. Clean obsolete remote branches (`copilot/*`, `cursor/*`) - optional
4. Verify no uncommitted changes hidden
5. Run quality gate to confirm project health

**Impact**: Minimal - repository is already in good shape. This is maintenance, not rescue.

---

## Current State Analysis

### ✅ What's Already Good

| Area                    | Status       | Notes                                                                          |
| ----------------------- | ------------ | ------------------------------------------------------------------------------ |
| **Directory Structure** | ✅ Clean     | 26 legit folders, no duplicates                                                |
| **Git Status**          | ✅ Clean     | Working tree clean, on feature branch                                          |
| **Archives**            | ✅ Organized | `archive/` has 4 subdirs (audits, prototypes, privacy-support, scripts-legacy) |
| **CLAUDE.md**           | ✅ Present   | Root (project-specific) + Global (dev guidelines) both exist                   |
| **Backups**             | ✅ None      | No `*_backup_*` or old folders                                                 |
| **Temp Folders**        | ✅ Minimal   | Only `supabase/.temp` (safe to remove)                                         |

### ⚠️ Minor Issues to Address

| Issue                             | Severity | Fix Time | Impact                |
| --------------------------------- | -------- | -------- | --------------------- |
| `supabase/.temp` exists           | Low      | 10s      | ~100KB space          |
| Root CLAUDE.md lacks version/date | Low      | 2min     | Documentation clarity |
| 47+ obsolete remote branches      | Low      | 5min     | Git cleanliness       |
| Quality gate not run recently     | Medium   | 5min     | Build confidence      |

---

## Implementation Plan

### Phase 1: Cleanup (Est: 2 minutes)

#### Step 1.1: Remove Temporary Cache

```bash
# Remove Supabase temporary cache (regenerates automatically)
rm -rf supabase/.temp
echo "✅ Removed supabase/.temp"
```

**Why**: This is build cache that Supabase CLI recreates on next run. Safe to remove, frees ~100KB.

#### Step 1.2: Verify No Hidden Changes

```bash
# Double-check for any uncommitted files
git status
git diff
git ls-files --others --exclude-standard

# Check for large untracked files
find . -type f -size +10M -not -path "./.git/*" -not -path "./node_modules/*"
```

**Why**: Explore agent might have missed untracked files. This ensures we don't lose work.

---

### Phase 2: Documentation Update (Est: 3 minutes)

#### Step 2.1: Add Version/Date to Root CLAUDE.md

**Current** (line 1 of `/c/Users/User/CLAUDE.md`):

```markdown
# CLAUDE.md

This file provides guidance to Claude Code...
```

**New** (add after first line):

```markdown
# CLAUDE.md

**Version**: 1.0.0
**Last Updated**: 2026-01-29
**Project**: Nossa Maternidade (iOS/Android Mobile App)

> For general developer guidelines and communication style, see [.claude/CLAUDE.md](.claude/CLAUDE.md) (global instructions).

This file provides guidance to Claude Code...
```

**Why**:

- Makes it clear when this was last reviewed
- Cross-references global CLAUDE.md to avoid confusion
- Follows semantic versioning like global file does

#### Step 2.2: Add Cross-Reference Note

At the end of root CLAUDE.md, add:

```markdown
---

## Related Documentation

- **Global Instructions**: [~/.claude/CLAUDE.md](file:///c/Users/User/.claude/CLAUDE.md) - Communication style, Windows setup, universal best practices
- **Supabase Guide**: [supabase/CLAUDE.md](supabase/CLAUDE.md) - Backend architecture, RLS, migrations
- **Source Code Guide**: [src/CLAUDE.md](src/CLAUDE.md) - UI patterns, components, navigation
```

**Why**: Helps future developers (or AI assistants) navigate the documentation hierarchy.

---

### Phase 3: Git Hygiene (Est: 5 minutes, Optional)

#### Step 3.1: List Obsolete Remote Branches

```bash
# List all remote branches
git branch -r

# Identify candidates for deletion (e.g., copilot/*, cursor/*)
git branch -r | grep -E "(copilot|cursor)/" | wc -l
```

**Expected**: ~47 obsolete branches from old AI assistant sessions.

#### Step 3.2: Clean Remote Branches (Interactive)

```bash
# Option A: Delete locally tracked remotes (safe)
git remote prune origin

# Option B: Delete on GitHub (requires push access)
# For each obsolete branch:
git push origin --delete copilot/BRANCH_NAME
```

**Decision Point**: Do you want to clean these up now, or leave for later?

**Pros**: Cleaner `git branch -a` output, easier to navigate
**Cons**: Takes 5 minutes, requires GitHub push access, not critical

---

### Phase 4: Quality Gate (Est: 5 minutes)

#### Step 4.1: Run Full Quality Gate

```bash
# Run all checks
npm run quality-gate
```

This runs:

1. **TypeScript check** (`npm run typecheck`) - Catch type errors
2. **ESLint** (`npm run lint`) - Enforce code style
3. **Build readiness** (`npm run check-build-ready`) - Verify build config
4. **Console.log check** - Ensure using `logger` instead

**Expected**: All checks pass (repository is clean).

**If Failures**:

- TypeScript errors → Fix with `npm run fix-types` or manually
- ESLint errors → Auto-fix with `npm run lint:fix`
- console.log found → Replace with `logger.info()` from `@/utils/logger`

#### Step 4.2: Run Tests (Optional)

```bash
# If you want extra confidence
npm test
```

**Why**: Confirms no regressions from cleanup.

---

### Phase 5: Commit & Merge (Est: 3 minutes)

#### Step 5.1: Review Changes

```bash
git status
git diff
```

**Expected Changes**:

- Deleted: `supabase/.temp/` (untracked, won't show in diff)
- Modified: `CLAUDE.md` (version/date added)

#### Step 5.2: Commit with Descriptive Message

```bash
git add CLAUDE.md

git commit -m "docs: add version/date stamp and cross-reference to CLAUDE.md

- Add version 1.0.0 and last updated date (2026-01-29)
- Cross-reference global .claude/CLAUDE.md for dev guidelines
- Add related documentation section at bottom
- Remove supabase/.temp cache (not tracked)

This improves documentation clarity and helps new developers
navigate the multi-level CLAUDE.md structure."
```

**Why**: Follows Conventional Commits, explains rationale.

#### Step 5.3: Merge to Main

```bash
# Ensure on feature branch
git branch --show-current  # Should show: feature/workspace-cleanup

# Switch to main and merge
git checkout main
git merge feature/workspace-cleanup --no-ff

# Push to remote
git push origin main

# Delete feature branch (local and remote)
git branch -d feature/workspace-cleanup
git push origin --delete feature/workspace-cleanup
```

**Why**:

- `--no-ff` creates merge commit for clear history
- Deletes branch after merge (cleanup)

---

## Verification Checklist

After completing all phases:

- [ ] `supabase/.temp` removed
- [ ] `CLAUDE.md` has version/date stamp
- [ ] `CLAUDE.md` cross-references global file
- [ ] `git status` shows clean working tree
- [ ] `npm run quality-gate` passes all checks
- [ ] Changes committed with descriptive message
- [ ] Merged to `main` and pushed
- [ ] Feature branch deleted
- [ ] (Optional) Obsolete remote branches cleaned

---

## Risk Assessment

| Risk                            | Likelihood        | Impact | Mitigation                                                          |
| ------------------------------- | ----------------- | ------ | ------------------------------------------------------------------- |
| Breaking changes during cleanup | Very Low          | Medium | Repository already clean, only doc changes                          |
| Git merge conflicts             | Very Low          | Low    | Working tree is clean, no pending changes                           |
| Quality gate failures           | Low               | Medium | Run `npm run fix-types` and `npm run lint:fix`                      |
| Deleting wrong remote branches  | Low (if cleaning) | Medium | Use `git push origin --delete` carefully, verify branch names first |
| Loss of work                    | Very Low          | High   | No actual code/feature changes, only maintenance                    |

**Overall Risk**: **LOW** - This is a maintenance task, not a refactor.

---

## Estimated Timeline

| Phase | Task                             | Time |
| ----- | -------------------------------- | ---- |
| 1     | Remove temp cache                | 10s  |
| 1     | Verify no hidden changes         | 1min |
| 2     | Update CLAUDE.md                 | 3min |
| 3     | Clean remote branches (optional) | 5min |
| 4     | Run quality gate                 | 5min |
| 4     | Run tests (optional)             | 3min |
| 5     | Commit & merge                   | 3min |

**Total**: 12-20 minutes (depending on optional steps)

---

## Post-Cleanup Benefits

1. **Documentation Clarity**: Version/date stamps help track when files were last reviewed
2. **Navigation**: Cross-references make it easier to find the right CLAUDE.md
3. **Git Hygiene**: Fewer remote branches = cleaner `git branch -a` output
4. **Confidence**: Quality gate confirms project is build-ready
5. **Maintainability**: Future cleanups will be easier with this baseline established

---

## Alternative: Do Nothing

**If you're happy with current state**:

- Repository is already clean
- Only missing version/date in CLAUDE.md (minor)
- Quality gate can be run separately before builds

**When to execute this plan**:

- Before next major release (iOS/Android launch)
- When onboarding new developers (documentation clarity helps)
- If you want to establish cleanup baseline for future work

---

## Decision Points (Answer Before Executing)

1. **Clean remote branches?** (Yes/No/Later)
   - Takes 5 extra minutes
   - Requires GitHub push access
   - Not critical, purely cosmetic

2. **Run tests?** (Yes/No)
   - Takes 3 extra minutes
   - Extra confidence, but not required for doc changes

3. **Merge immediately?** (Yes/No/Review First)
   - Changes are minimal (doc only)
   - But always good to review first

---

## Conclusion

**Status**: Repository is **already in good shape**. This plan addresses minor documentation improvements and optional git hygiene.

**Recommendation**: Execute Phase 1-2 (cleanup + docs), skip Phase 3 (remote branches), run Phase 4 (quality gate), commit/merge Phase 5.

**Total time**: ~12 minutes for core improvements.

**Next Steps**: Read this plan, decide on optional phases, then execute or adjust as needed.
