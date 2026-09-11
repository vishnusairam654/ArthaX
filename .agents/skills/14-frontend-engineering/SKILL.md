---
name: frontend-engineering
description: Next.js Route Groups for the six ARTHAX portals, atomic-design component library structure, and the features/hooks/lib/providers conventions under apps/web. Use for any frontend implementation work. This skill implements what Design Director (skill 15/17/18) specifies — it does not make token or motion decisions itself.
---

# Frontend Engineering (ARTHAX)

## Overview
`apps/web` is a single Next.js app using Route Groups to isolate the six portals while sharing design system, auth session, and component library.

## Structure
```
apps/web/
├── app/
│   ├── (public)/      # Guide board, unauthenticated
│   ├── (auth)/         # Login/Register
│   ├── user/            # User Portal
│   ├── central-bank/    # Central Bank Oversight
│   ├── banks/            # Commercial Bank Portal
│   ├── stocks/            # Trading & Market
│   └── shop/               # Customization & Inventory
├── components/          # Atomic Design: atoms → molecules → organisms
├── features/             # Domain-specific business logic (transfers/, portfolio/, fd/, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions & SDKs (API client, formatters)
├── providers/            # Context & state providers (auth session, theme)
└── styles/               # Global CSS & Tailwind config
```

## Rules
1. Route Groups mirror portals 1:1 — don't split one portal's routes across groups or merge two portals into one group for convenience.
2. `features/` holds domain logic (e.g., `features/transfers/useTransferFlow.ts`); `components/` holds presentation-only, portal-agnostic UI. A component that only makes sense for one portal's transfer flow belongs in `features/`, not `components/`.
3. Implement Design Director's token/motion specs exactly — Frontend doesn't invent a new spacing value or pick a new easing curve mid-implementation; escalate back to Design Director instead.
4. Consume `@arthax/types` for every API response shape — no inline `any` or ad-hoc interfaces duplicating what the shared package already defines.
5. Component Librarian (skill 28) re-themes Shadcn/React Bits/Kokonut patterns into `@arthax/ui` *before* Frontend uses them — Frontend should never import an unmodified third-party component directly into a portal.

## Common mistakes
- Building a portal-specific one-off component that duplicates something already in `@arthax/ui`.
- Fetching data with ad-hoc `fetch()` calls scattered through components instead of a consistent `lib/` API client.
- Skipping loading/error/empty states (skill 18) because "the happy path works."

## Handoff
Owned by **Frontend**. Built after Design Director/Component Librarian/Motion & 3D Specialist lay foundations (skill 02, phase 4), and after Identity + Ledger are live for portal-specific screens (phases 5-6).
