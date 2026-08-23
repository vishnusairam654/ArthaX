# ARTHAX AI DEVELOPMENT WORKFLOW

## Purpose

This document defines **how AI agents must be used to build ARTHAX**.

ARTHAX is too large to build in one prompt, one day, or one uncontrolled agent session. The project must be developed as a sequence of small, verified phases using specialized agents and reusable skills.

The human developer remains the **product owner and final decision-maker**. AI agents act as an engineering team.

---

# 1. Core Principle

Do **not** ask an AI agent:

> "Build ARTHAX."

Instead ask it to complete one clearly bounded piece of ARTHAX.

The correct model is:

```text
Human Product Owner
        |
        v
ARTHAX Director
        |
        v
Planning
        |
        +-----------------------+
        |                       |
        v                       v
Specialist Agent(s)       Skill Selection
        |                       |
        +-----------+-----------+
                    |
                    v
                Implementation
                    |
                    v
                 Testing
                    |
                    v
                Review Gates
                    |
             +------+------+
             |             |
           PASS           FIX
             |             |
             v             +-----> Builder / Specialist
          Checkpoint
             |
             v
        Next bounded task
```

AI should be used as a **controlled engineering team**, not as a one-shot code generator.

---

# 2. Permanent Project Context

The repository contains:

```text
ARTHAX_PROJECT_CONTEXT.md
```

This file is the permanent project context and should be treated as the first source of truth for every agent session.

Before performing meaningful work, agents must:

1. Read `ARTHAX_PROJECT_CONTEXT.md`.
2. Inspect the current repository.
3. Inspect the relevant existing implementation.
4. Determine the current development phase.
5. Identify the exact task scope.
6. Load only the skills relevant to the task.
7. Check whether the task conflicts with existing architecture or product decisions.

Agents must not assume that an unfinished feature is permission to redesign the project.

---

# 3. Human vs AI Responsibilities

## Human / Product Owner

The human decides:

- What feature should exist.
- Why it exists.
- Which phase it belongs to.
- Whether a plan is approved.
- Product behavior that is ambiguous.
- Final visual direction decisions that are intentionally undecided.
- Whether a breaking architectural change is acceptable.
- Whether a major feature should be added or postponed.

## AI Agents

AI agents are responsible for:

- Researching implementation options.
- Inspecting the existing codebase.
- Producing implementation plans.
- Writing code.
- Writing tests.
- Reviewing code.
- Reviewing UI.
- Finding edge cases.
- Updating documentation.
- Detecting inconsistencies.
- Reporting risks.

AI agents must not silently invent product requirements.

---

# 4. Development Phases

ARTHAX is developed in phases.

```text
Phase 0  Local Environment
Phase 1  Monorepo Foundation
Phase 2  Identity / Authentication
Phase 3  Core Ledger + CLS / Settlement
Phase 4  Design System + UI Foundation
Phase 5  Banking Domain
Phase 6  User Portal
Phase 7  Stock Market + Tax Rules
Phase 8  Shop + Rewards
Phase 9  Mailbox + Notifications
Phase 10 Financial Audit
Phase 11 ARTHAX World Integration
Phase 12 QA + Accessibility
Phase 13 DevOps + Documentation / Deployment
```

The project must move forward **phase by phase**.

Do not build a later phase simply because an agent can technically do it now.

Example:

```text
Do not build Stock Portal before the Core Ledger is proven.
Do not build Shop purchasing before ARTH transactions are proven.
Do not build financial actions before Identity/Auth is secure.
```

---

# 5. Phase Workflow

Every phase follows this lifecycle:

```text
1. PLAN
2. REVIEW PLAN
3. IMPLEMENT SMALL TASK
4. TEST
5. REVIEW
6. FIX
7. CHECKPOINT
8. UPDATE DOCUMENTATION
9. MOVE TO NEXT TASK
```

A phase is not considered complete just because the happy path works.

---

# 6. Step 1 — Planning

Every meaningful phase or feature begins with the **ARTHAX Director Agent**.

The Director must not immediately code.

It must first produce:

- Current state
- Goal
- Dependencies
- Required skills
- Required agents
- Files/modules likely to change
- Data changes
- API changes
- UI changes
- Risks
- Security concerns
- Testing requirements
- Acceptance criteria
- Out-of-scope items

Example request:

```text
ARTHAX Director:

Read ARTHAX_PROJECT_CONTEXT.md and inspect the repository.

We are starting Phase 2: Identity / Authentication.

Do not write code yet.

Produce a detailed implementation plan for this phase.
Identify dependencies, relevant skills, files/modules involved,
security requirements, test requirements, and explicit out-of-scope work.
Do not make product decisions that are not already defined.
```

---

# 7. Step 2 — Plan Review

The human reviews the Director's plan.

Possible outcomes:

```text
APPROVE
MODIFY
REJECT / REDESIGN
```

Only after approval should implementation start.

Do not allow an agent to execute a large unreviewed plan just because it generated the plan itself.

---

# 8. Step 3 — Small Bounded Implementation

Implementation tasks must be small enough to understand and verify.

Bad task:

```text
Build the entire banking system.
```

Good task:

```text
Implement creation of a bank account for an authenticated user.
Support purpose selection, bank recommendation data, account creation,
validation, persistence, error states, and tests.
Do not implement loans, stock trading, FD, or inter-bank settlement.
```

Each task must explicitly state:

- What is included.
- What is excluded.
- Acceptance criteria.
- Relevant skills.
- Required tests.

---

# 9. Skill Usage Rules

A **skill** is reusable knowledge, rules, or specialist guidance.

An **agent** is a worker that uses one or more skills.

Agents should load skills progressively and only when relevant.

Do not load the entire skill library for every task.

Example for a User Portal UI task:

```text
build-modern-web-projects
frontend-design
arthax-design-tokens
arthax-layout-and-motion
material-rounded-smooth
anti-ai-design
arthax-brand-identity
```

A Shop task may additionally use:

```text
arthax-shop-gamification
```

A transaction-status UI task may additionally use:

```text
arthax-transaction-states
```

A backend database task should not load unrelated Shop visual skills.

---

# 10. Current Design / Frontend Agent Team

The current frontend/design agent group contains six agents.

## 10.1 ARTHAX Director Agent

Role:

- Overall orchestrator.
- Decides task scope.
- Chooses specialist agents.
- Chooses relevant skills.
- Enforces project context.
- Prevents scope creep.
- Defines acceptance criteria.
- Coordinates review gates.

Must not become the default coding agent for everything.

---

## 10.2 ARTHAX Frontend Builder Agent

Role:

- Builds Next.js UI.
- Builds portal screens.
- Builds components.
- Integrates approved assets.
- Implements responsive layouts.
- Implements forms and states.
- Implements frontend behavior.

Typical skills:

- `build-modern-web-projects`
- `frontend-design`
- `arthax-design-tokens`
- `material-rounded-smooth`
- `arthax-layout-and-motion`
- `anti-ai-design`
- relevant ARTHAX asset/state skills

Must not invent missing assets.

---

## 10.3 ARTHAX Visual Director Agent

Role:

- Determines visual hierarchy.
- Reviews layout composition.
- Reviews design-system usage.
- Reviews typography/color token usage.
- Decides appropriate container usage.
- Controls portal-specific visual personality.
- Ensures ARTHAX remains coherent.

It provides direction to the Frontend Builder rather than replacing the builder for every implementation task.

---

## 10.4 ARTHAX Motion Agent

Role:

- Owns motion design.
- Implements GSAP / Motion behavior.
- Reviews page transitions.
- Reviews interaction motion.
- Reviews financial transaction animation.
- Reviews empty-state animation.
- Reviews Shop reveal motion.
- Ensures reduced-motion behavior.

Motion must communicate state or hierarchy.

Do not add animation merely to make a screen look impressive.

---

## 10.5 ARTHAX Asset Agent

Role:

- Selects existing ARTHAX assets.
- Confirms correct asset usage.
- Checks dimensions and intended contexts.
- Handles bank logos, portal imagery, stock assets, pets, avatars, frames, banners, empty-state assets, and documents.
- Identifies missing assets.

CRITICAL RULE:

```text
Missing asset
    |
    v
ASK HUMAN
```

Never silently fabricate, replace, or download an unrelated image for an ARTHAX-branded screen.

---

## 10.6 ARTHAX Design Auditor Agent

Role:

- Final visual / UX review.
- Anti-AI review.
- Layout review.
- Accessibility review.
- Motion review.
- Responsive review.
- Design-token review.
- State coverage review.

The Auditor must return specific findings and exact fixes rather than vague feedback.

Example output:

```text
ARTHAX DESIGN AUDIT

Status: NEEDS WORK

Critical:
- Missing error state for transfer failure.

High:
- Main balance is incorrectly enclosed in a generic card.
- Repeated 24px padding across unrelated sections.

Medium:
- Transaction rows use generic icon treatment.

Suggested fixes:
...
```

---

# 11. Backend / Financial Agent Team

These agents should be introduced when the project reaches backend and financial implementation phases.

Planned specialists:

```text
ARTHAX Backend Engineer
ARTHAX Database Engineer
ARTHAX Financial Engineer
ARTHAX Security Engineer
ARTHAX QA / Financial Auditor
ARTHAX DevOps Engineer
```

Do not create or activate these agents for frontend work unless the task genuinely crosses those domains.

---

# 12. Example Workflow — New UI Screen

User asks:

> Build the User Portal overview.

Workflow:

```text
Human
  |
  v
Director
  |
  +--> inspect project
  +--> identify User Portal task
  +--> identify skills
  +--> create plan
  |
  v
Human approves
  |
  v
Visual Director
  |
  +--> layout direction
  +--> hierarchy
  +--> asset placement
  |
  v
Frontend Builder
  |
  +--> implement
  |
  v
Motion Agent
  |
  +--> implement approved motion
  |
  v
Design Auditor
  |
  +--> AI-slop review
  +--> UX review
  +--> accessibility review
  +--> responsive review
  |
  +------ PASS ------> checkpoint
  |
  +------ FIX -------> Frontend Builder
```

---

# 13. Example Workflow — Financial Feature

Example:

> Implement user-to-user money transfer.

Workflow:

```text
Director
   |
   v
Financial Engineer
   |
   +--> define business flow
   +--> identify ledger effects
   +--> identify state machine
   |
   v
Database Engineer
   |
   +--> schema / migration
   |
   v
Backend Engineer
   |
   +--> API + business logic
   |
   v
Financial Auditor
   |
   +--> debit = credit
   +--> transaction consistency
   +--> failure / reversal paths
   |
   v
Frontend Builder
   |
   +--> transfer UI
   |
   v
Motion Agent
   |
   +--> transaction-state motion
   |
   v
Design Auditor + QA
```

---

# 14. Example Workflow — Database Migration

```text
Director
  |
  v
Database Engineer
  |
  +--> inspect schema
  +--> design migration
  +--> identify constraints
  +--> identify rollback/recovery concerns
  |
  v
Financial Engineer (if financial data is affected)
  |
  +--> verify financial invariants
  |
  v
Backend Engineer
  |
  +--> adapt domain logic
  |
  v
QA
  |
  +--> migration tests
  +--> regression tests
```

---

# 15. Example Workflow — New Portal

A portal is too large for a single uncontrolled prompt.

Use:

```text
1. Portal definition
2. Information architecture
3. Design direction
4. Route structure
5. Data requirements
6. Component map
7. Implement shell
8. Implement one major screen
9. Review
10. Implement remaining screens one at a time
11. Test states
12. Audit
13. Checkpoint
```

Do not generate the entire portal blindly in one call.

---

# 16. Example Workflow — Bug Fix

Bug fixes should be narrow.

```text
1. Reproduce
2. Identify root cause
3. Explain expected behavior
4. Implement smallest safe fix
5. Add regression test
6. Run relevant tests
7. Review affected domain
8. Report
```

Do not allow an agent to refactor unrelated architecture during a bug fix unless explicitly approved.

---

# 17. Example Workflow — Security-Sensitive Change

For authentication, financial password, OTP, sessions, permissions, transfers, or admin access:

```text
Director
   |
   v
Security Engineer
   |
   v
Implementation Specialist
   |
   v
Security Review
   |
   v
QA
```

Never merge a security-sensitive change based only on the builder's self-review.

---

# 18. Example Workflow — Ledger Change

A ledger change is high-risk.

Required sequence:

```text
Director
  ↓
Financial Engineer
  ↓
Database Engineer
  ↓
Backend Engineer
  ↓
Financial Auditor
  ↓
QA
  ↓
Integration
```

Mandatory checks include:

- Double-entry integrity.
- Total debits = total credits.
- Correct transaction lifecycle.
- Failure handling.
- Reversal handling.
- Reconciliation behavior.
- Balance consistency.
- Auditability.
- No accidental money creation.
- No accidental money destruction.

---

# 19. Definition of Done

A task is not "done" because code was generated.

A task is complete only when applicable items below are satisfied:

```text
[ ] Requirements implemented
[ ] Existing architecture respected
[ ] Relevant skills used
[ ] Data model correct
[ ] API/backend behavior correct
[ ] UI implemented
[ ] Loading state handled
[ ] Empty state handled where applicable
[ ] Error state handled
[ ] Retry/recovery handled where applicable
[ ] Responsive behavior handled
[ ] Accessibility reviewed
[ ] Motion reviewed
[ ] Anti-AI review completed for UI
[ ] Tests added/updated
[ ] Documentation updated
[ ] No unrelated changes
[ ] Git checkpoint created
```

Financial features additionally require:

```text
[ ] Double-entry integrity verified
[ ] Correct ledger entries
[ ] Correct transaction state machine
[ ] Reconciliation verified
[ ] Failure/reversal behavior verified
[ ] Audit trail verified
```

---

# 20. Git Checkpoints

Commit after every meaningful completed unit.

Good examples:

```text
init monorepo
setup nextjs app
setup nestjs api
add identity schema
implement email otp verification
implement gov id creation
implement financial password
implement session auth
add ledger schema
implement transaction lifecycle
implement settlement core
add first bank domain
```

Avoid one giant commit containing an entire phase.

Git history should show incremental development, debugging, and validation.

---

# 21. Context Protection Rules

Agents must preserve these ARTHAX decisions unless the human explicitly changes them.

## Identity

```text
1 Email -> 1 GOV ID
1 GOV ID -> 1 ARTHAX User
1 ARTHAX User -> many bank accounts
One main login across banks
```

## Currency

```text
One currency: ARTH
No coins
No tokens
No separate Shop currency
```

## Portals

```text
Central Guide Board
Central Bank Portal
Bank Portal
User Portal
Stock Portal
Shop
```

Shared systems are not separate portals.

## Ledger

```text
One core financial ledger
Double-entry integrity
```

## GOV

GOV is currently an identity anchor only.
Do not build full citizen/job/business/government functionality unless explicitly requested.

---

# 22. Preventing AI Drift

Agents must not silently introduce:

- Separate logins for each bank.
- Separate currencies.
- Separate shop money.
- Separate ledger systems.
- Unapproved microservices.
- Unapproved authentication providers.
- New portals for ordinary features.
- Generic UI copied across all portals.
- Invented assets.
- Generic placeholder visuals that become permanent.
- Product features not defined in the project context.

If an agent believes the architecture needs a change, it must stop and propose the change rather than silently implementing it.

---

# 23. Anti-AI UI Rule

Whenever building frontend UI, apply the ARTHAX anti-AI process.

Do not automatically default to:

- Generic SaaS hero sequences.
- Bento grids without content justification.
- Card wrappers around everything.
- Identical padding/radius everywhere.
- Generic marketing copy.
- Generic icons for every concept.
- Decorative 3D blobs.
- Purple/indigo AI aesthetic.
- Shallow happy-path UI.

The correct goal is **intentional product-specific design**, not random asymmetry.

A repeated-data component may be repeated when repetition is appropriate.

Examples:

```text
10 stock listings -> repeated structure is appropriate
Transaction rows -> repeated structure is appropriate
Shop inventory -> repeated structure is appropriate
```

But:

```text
Hero -> should not be a generic card
Main wealth figure -> should not be trapped in a meaningless card
Empty state -> should not become a generic card grid
Onboarding -> should not become a generic three-card pattern
```

---

# 24. Asset Honesty Rule

ARTHAX has a curated asset library.

When a required asset does not exist:

```text
MISSING ASSET
     ↓
STOP
     ↓
ASK HUMAN
```

Do not:

- Download a random stock image.
- Generate an asset without approval.
- Replace it with a generic icon.
- Use another brand's visual.
- Add a random placeholder that looks production-ready.

The human decides whether to create the missing asset.

---

# 25. AI Model Strategy

Use the available AI models according to task difficulty.

## Strong reasoning model

Reserve for:

- Architecture
- Security architecture
- Ledger design
- Difficult debugging
- Major refactoring
- Important design audits

## Strong coding model

Use for:

- Backend implementation
- Database implementation
- Tests
- Large refactors
- Repetitive implementation

## Fast / large-context model

Use for:

- UI implementation
- Large repository analysis
- Documentation
- Reviews
- Asset mapping
- Less risky implementation

## Small/low-cost models

Use for:

- Simple fixes
- Renaming
- Documentation cleanup
- Small transformations
- Routine analysis

Do not spend the strongest model on trivial tasks.

---

# 26. Recommended Working Surfaces

ARTHAX may be developed using multiple coding surfaces.

## Antigravity IDE

Use as the primary visual development environment for:

- Frontend work
- Browser/UI inspection
- Agent-driven coding
- Visual review
- Debugging

## Antigravity CLI

Use for:

- Terminal workflows
- Repository operations
- Scripts
- Database tooling
- Tests
- Background work
- CI-oriented operations

## OpenCode

Use as a flexible agent/model environment when useful for:

- Custom skill/agent workflows
- Model routing
- Specialist agent experimentation
- CLI-driven development

Do not maintain contradictory versions of the same agent/skill rules across tools.

Keep the repository version canonical.

---

# 27. Recommended Prompt Pattern

Every substantial agent prompt should follow this structure:

```text
CONTEXT
Read ARTHAX_PROJECT_CONTEXT.md.

CURRENT PHASE
<phase>

TASK
<exact task>

SCOPE
<what is included>

OUT OF SCOPE
<what must not be touched>

SKILLS
<relevant skills, if explicit>

CONSTRAINTS
<architecture/security/design rules>

ACCEPTANCE CRITERIA
<exact completion conditions>

PROCESS
Plan → implement → test → report.

STOP CONDITION
Do not continue into the next feature.
```

---

# 28. Good vs Bad AI Prompts

## Bad

```text
Build ARTHAX banking.
```

## Better

```text
Read ARTHAX_PROJECT_CONTEXT.md.

We are in Phase 5.

Implement creation of a savings bank account for an authenticated user.

Scope:
- Purpose selection
- Eligible bank selection
- Account creation API
- Persistence
- Validation
- UI
- Loading/error/success states
- Tests

Do not implement loans, FD, stocks, or inter-bank settlement.

Do not change the existing identity architecture.

Plan first. Then implement after verifying the repository.
```

---

# 29. Phase Completion Gate

Before moving from one phase to the next, run a checkpoint review.

Example:

```text
Phase 2 complete?

[ ] Requirements complete
[ ] Security review complete
[ ] Tests passing
[ ] No architectural drift
[ ] Documentation updated
[ ] Git checkpoint created
[ ] Known risks recorded
```

If the answer is no, remain in the phase.

Do not continue simply because the next phase looks more exciting.

---

# 30. Final Operating Model

The long-term ARTHAX AI workflow is:

```text
                    HUMAN
                      |
                      v
             ARTHAX DIRECTOR
                      |
             Plan / Scope / Route
                      |
        +-------------+-------------+
        |             |             |
        v             v             v
     Domain        Frontend      Visual
   Specialist      Builder      Director
        |             |             |
        +-------------+-------------+
                      |
                      v
                Motion / Assets
                      |
                      v
                  QA / Tests
                      |
                      v
             Financial / Security
                   Reviews
                      |
                      v
               DESIGN AUDITOR
                      |
             +--------+--------+
             |                 |
            PASS              FIX
             |                 |
             v                 +-----> appropriate agent
         CHECKPOINT
             |
             v
        NEXT BOUNDED TASK
```

The key principle is:

> **Plan small. Build small. Test immediately. Review independently. Checkpoint. Then continue.**

ARTHAX should grow through many controlled, verified increments rather than one giant AI generation.
