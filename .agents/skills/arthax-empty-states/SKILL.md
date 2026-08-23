---
name: arthax-empty-states
description: >
  Maps the 6 empty-state illustrations to their screens and defines how they animate in and pair with
  copy. Use this any time you're building a screen that can have zero items — no bank linked, no
  transactions yet, no stocks owned, empty shop inventory, empty mailbox/notifications, no FD opened.
  This is the anti-ai-design "60-70% wall" made concrete with real assets — these are exactly the
  states most builds skip or leave as a bare "No data" text.
---

# ARTHAX Empty States

## Illustration → screen mapping

| Illustration | Screen | Trigger |
|---|---|---|
| `no_bank_account.png` | User Portal, first login | User hasn't linked any bank yet — this is an onboarding state, not just an empty list, and should carry a clear primary action ("Link your first bank") |
| `no_transactions.png` | Bank Portal / User Portal history tabs | A linked account with zero transaction history — new account, not an error |
| `no_FD.png` | User Portal, Fixed Deposits section | No active FDs — pairs naturally with a "Start a Deposit" CTA |
| `no_stocks.png` | Stock Portal, portfolio view | No holdings yet — distinguish this from a *browse* view (which should never look empty, it has the 10 listed companies) |
| `empty_inventory.png` | Shop Portal, "My Items"/inventory tab | Nothing purchased/unlocked yet — different from the shop's browse grid, which is always populated |
| `empty_mailbox.png` | Notifications/messages surface (wherever that lives — the report doesn't name a dedicated portal for this, worth confirming it has a home) |

## The rule these exist to enforce

Per `anti-ai-design`: most AI-assisted builds get the happy path (populated list) right and leave
everything else — loading, error, empty — as a generic fallback. You now have real illustrations for
6 specific empty states, which removes the excuse. Before any list/grid screen ships, it needs a
storyboarded empty state using its illustration, not a placeholder "No data available" string.

## Presentation pattern

Consistent structure across all 6, so a user learns the pattern once:

```
[illustration, centered, ~160-240px depending on portal]
[one-line headline — what's true right now, not an apology]
[one-line supporting text — what to do about it, if anything]
[primary CTA button, only where an action actually exists]
```

Not every empty state needs a CTA — `no_transactions` on a brand-new account doesn't need a button
("nothing here yet" is just informational), while `no_bank_account` and `empty_inventory` do (there's
a clear next action). Don't force a button onto a screen that doesn't need one just for consistency.

## Animation

Subtle, not attention-grabbing — an empty state is a quiet moment, not a hero moment:

```js
gsap.from(illustration, {
  opacity: 0,
  y: 12,
  duration: 0.5,
  ease: "power2.out",
});
gsap.from([headline, supportingText, ctaButton], {
  opacity: 0,
  y: 8,
  duration: 0.4,
  stagger: 0.08,
  delay: 0.15,
  ease: "power2.out",
});
```

No looping motion, no bounce — this should feel like the screen settling into its resting state, not
demanding attention. That restraint is itself the "not boring" move here: the interesting part of an
empty state is that it exists and is considered at all, not that it's flashy.

## Copy pairing

Headline/supporting-text tone is a `design:ux-copy` skill concern (available in your plugin catalog) —
worth a dedicated pass per screen once the illustration placement above is settled, since generic
copy ("No items found") next to a bespoke illustration undercuts the effort that went into the art.
