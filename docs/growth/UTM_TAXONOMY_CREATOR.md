# UTM Taxonomy — Creator-Led Growth (Nathalia Valente)

## Objective
Define a single naming convention for creator campaigns so app attribution, paywall conversion, and CAC analysis remain consistent.

## Required Query Parameters

| Param | Required | Example |
| --- | --- | --- |
| `utm_source` | yes | `instagram` |
| `utm_medium` | yes | `organic_story` |
| `utm_campaign` | yes | `nathia_sprint_wk03` |
| `content_id` | yes | `reel_2026_02_09_01` |
| `creator_cta_id` | yes | `story_swipeup_01` |

## Allowed Values

### utm_source
- `instagram`
- `tiktok`
- `youtube`
- `referral`
- `remarketing`

### utm_medium
- `organic_reel`
- `organic_story`
- `organic_feed`
- `organic_live`
- `paid_video`
- `paid_static`

### utm_campaign
Format:
`<cluster>_<sprint>_<week>`

Examples:
- `nathia_acquisition_wk01`
- `nathia_trial_push_wk04`
- `nathia_winback_wk08`

### content_id
Format:
`<channel>_<yyyy_mm_dd>_<sequence>`

Examples:
- `reel_2026_02_09_01`
- `story_2026_02_09_03`
- `live_2026_02_10_01`

### creator_cta_id
Format:
`<placement>_<intent>_<sequence>`

Examples:
- `story_swipeup_01`
- `bio_link_trial_01`
- `live_comment_pin_01`

## URL Example

```text
nossamaternidade://onboarding/welcome?utm_source=instagram&utm_medium=organic_story&utm_campaign=nathia_trial_push_wk04&content_id=story_2026_02_09_03&creator_cta_id=story_swipeup_01
```

## Data Quality Rules
1. Never ship creator links without all required parameters.
2. `content_id` must be unique per published creative.
3. `creator_cta_id` must identify a single CTA placement.
4. Rename campaigns only between weeks, never mid-week.
5. If an override is needed, log it in weekly growth notes before publishing.
