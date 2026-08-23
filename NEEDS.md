# ARTHAX — Asset & Decision Requests

Living list of things the human needs to provide or confirm.
Items here are NOT fabricated in code — screens ship with visible placeholders instead.

## Assets wanted

| # | What | Where used | Spec | Status |
|---|---|---|---|---|
| 1 | Security shield/lock icon | Step-up Financial Password modals, security-failure states | ~64×64px PNG, illustrated style matching existing icon set (flat, warm palette) | ⬜ Needed before User Portal transfer flow (Phase 6) |
| 2 | Grain/noise texture tile (optional) | Hero backgrounds, subtle paper feel | Seamless 256×256 PNG, very low contrast | ⬜ Optional — CSS-only fallback will be used until provided |
| 3 | Favicon check | Browser tab | Confirm `favicon.png` is the final mark | ⬜ Low priority |

## Decisions to confirm

| # | Decision | Default being used until confirmed |
|---|---|---|
| 1 | Watermark split | `primary_watermark.png` → official documents; `watermark_transparent.png` / `watermark_3.png` → low-opacity (5–8%) background texture |
| 2 | Bank positioning copy | Nava=new, Samaya=time, Setu=bridge, Sthira=stable, Vayu=fast — used in comparison copy |

> When an item above is delivered, drop the file into `assets/` (correct subfolder),
> tick its status here, and the UI will pick it up on next build.
