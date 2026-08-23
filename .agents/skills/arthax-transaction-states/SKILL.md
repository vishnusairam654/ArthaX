---
name: arthax-transaction-states
description: >
  Owns the transaction-status icon set (completed, failed, finalyzing, pending, processing, reversed)
  and how they animate as a transaction moves through the ledger's state machine. Use this skill any
  time you're building a transfer, FD, trade, or settlement flow that shows live status — the status
  badge on a transaction row, the full-screen "processing" moment, or a receipt/confirmation view.
  Works with arthax-design-tokens for color and gsap-animation-design for the state-change motion.
---

# ARTHAX Transaction States

## The state-machine gap you need to close first

The project report defines the ledger's transaction lifecycle as:

`Pending → Validating → Authorized → Processing → Settling → Completed`, with `Failed`, `Reversed`,
and `Cancelled` as branch states.

That's up to 9 distinct states. The icon set in `assets/icons/` only covers 6: `completed`, `failed`,
`finalyzing` (likely your `Settling` icon, given the naming), `pending`, `processing`, `reversed`.

Missing: **`Validating`**, **`Authorized`**, and **`Cancelled`** have no dedicated icon.

Before wiring status UI, make one of these calls — don't let the UI silently collapse states that the
ledger itself treats as distinct:

1. **Collapse for display** — `Validating` and `Authorized` both render as the `pending` icon (they're
   pre-processing holds from the user's point of view anyway), and `Cancelled` reuses the `failed`
   icon with different copy ("Cancelled by you" vs "Transaction failed"). Fastest to ship, and
   defensible — a user doesn't need to see every internal ledger state.
2. **Commission 2-3 more icons** to match the full state machine 1:1. More accurate, more work, and
   only worth it if you want the status timeline itself (see below) to be a portfolio-piece detail.

Default to option 1 unless you're specifically trying to show off ledger rigor in a demo — in which
case the full timeline view (below) is exactly where that rigor becomes visible without needing new
icons for every micro-state.

## Status badge (inline, transaction list rows)

Small, quiet, and consistent — this appears dozens of times per screen on Bank/User/Stock portals, so
it should never compete for attention with the transaction amount itself.

```css
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  border-radius: var(--radius-full); /* from material-rounded-smooth */
  font-size: var(--text-micro);
  font-family: var(--font-body); /* Cantarell */
}
```

Color mapping (reuses `arthax-design-tokens` — no new hues):

| State | Icon | Badge tint |
|---|---|---|
| Pending / Validating / Authorized | `pending.png` | `--surface-accent` (Sage Mint) background, Charcoal text |
| Processing | `processing.png` | Soft Blue background, Charcoal text — this one should have subtle looping motion (see below) |
| Settling | `finalyzing.png` | Deep Blue background, white text |
| Completed | `completed.png` | Sage Mint background, Deep Blue text — calm, not celebratory; save celebration for the Shop/reward system, not routine transfers |
| Failed / Cancelled | `failed.png` | A dedicated `--color-loss`/error token is still missing (flagged in `arthax-design-tokens`) — don't reach for an unaudited red; route this through the Token & Theming Agent first |
| Reversed | `reversed.png` | Same — needs the same missing error/warning token before this ships correctly |

## The processing moment (full-screen or modal)

This is the highest-stakes UI moment in the whole product — someone is watching to see if their money
moved. Two rules:

**Never let it feel stuck.** A static spinner past ~2 seconds reads as broken. Use GSAP to drive a
determinate-feeling animation even when the actual backend timing is uncertain: a slow, continuously
advancing progress indicator that eases toward (but doesn't reach) 90% while waiting, then snaps to
100% on the real completion event. This is a well-known pattern for exactly this trust problem.

**Never skip the failure path.** Per `anti-ai-design`'s "60-70% wall" — most builds nail the pending
→ completed animation and leave failed/reversed as an afterthought. Storyboard all three exits
(completed, failed, reversed) with equal care before writing any code.

```js
// GSAP sketch — optimistic progress that never fake-completes
gsap.to(progressBar, {
  width: "90%",
  duration: 8,
  ease: "power1.out", // decelerating — feels like real progress, not a lie
});
// on real completion event:
gsap.to(progressBar, { width: "100%", duration: 0.3, ease: "power2.out",
  onComplete: () => showStateIcon('completed') });
```

## Status timeline (receipt / transaction detail view)

If you go with option 2 above (full state coverage), this is where it pays off — a vertical or
horizontal stepper showing every state the transaction actually passed through, each with a timestamp,
pulled straight from the ledger's own state history rather than inferred. This single component is a
strong, concrete answer to "show me you understand transaction integrity" in an interview, and it's a
natural home for the `og/receipt.png` and `og/statement_confirmation.png` assets — see
`arthax-brand-identity` for how those get used.

Reduced motion: the whole state-change system (badge transitions, progress animation, timeline
stepper) needs a `prefers-reduced-motion` fallback per `gsap-animation-design` — swap eased animation
for an instant state snap, never remove the information itself.
