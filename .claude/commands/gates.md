---
name: gates
description: Show TestFlight gates scoreboard and next action
category: Release
---

# Gates - Release Scoreboard

Shows current status of all TestFlight gates and recommends next action.

## Usage

```bash
/gates
```

## Output

Displays:

- Gate scoreboard (G-1 through G7)
- Current blocking gate
- Next recommended action
- Link to detailed documentation

## Example

```
TestFlight Gates - Nossa Maternidade
════════════════════════════════════

✅ G-1  Secrets Scan
✅ G0   Diagnose Production
✅ G1   Quality Gate
✅ G2.5 AI Consent Modal
⏳ G2   Authentication ← BLOCKER
⏳ G3   Row Level Security
⏳ G4   RevenueCat (IAP)
⏳ G5   NathIA + Caching
⏳ G6   EAS Production Build
⏳ G7   TestFlight Submit

════════════════════════════════════

NEXT ACTION: Execute G3 (RLS) SQL verification

Commands:
  /g3-rls          - Start G3 validation
  /g2-auth         - Start G2 validation (after G3)

Docs: docs/release/GATES.md
```

## Implementation

Read `docs/release/GATES.md` and display formatted scoreboard.

Determine next blocker based on:

1. First PENDING gate in sequence
2. If G2-G5 all PASS → recommend G6
3. If G6 PASS → recommend G7
