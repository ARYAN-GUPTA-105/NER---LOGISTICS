# SMART NER LOGISTICS — MASTER PROJECT CONTEXT

## Project

Smart NER Logistics — SIH 2026, Problem Statement PS 26002.

## Product Vision

A unified logistics intelligence platform for the North Eastern Region that will eventually support logistics monitoring, accessibility/disruption intelligence, field reporting, vehicle tracking, route optimization, alerts, analytics, and AI-assisted decision making.

## Development Strategy

The product will be built phase by phase.

Each phase must:

* Have clearly defined scope.
* Be independently testable.
* Avoid implementing future-phase functionality early.
* Preserve clean architecture for future expansion.
* Work on desktop and mobile where applicable.

## User Roles

The platform will eventually support:

1. Driver
2. Logistics Company
3. Field Officer
4. Authority / Admin

## Architecture Principle

Use one unified platform with role-based experiences rather than four disconnected applications.

Conceptually:

User
→ Authentication
→ Role
→ Role-specific application area

## Current Phase

Phase 1 — Authentication / Login Experience.

Phase 1 contains:

* Phase 1A — Role Selection UI
* Phase 1B — Role-Specific Login UI
* Phase 1C — Authentication Architecture
* Phase 1D — Responsive Testing & Final Polish

## Hard Phase Boundary

Phase 1 ends after successful authentication.

Do NOT build:

* Driver dashboard
* Logistics dashboard
* Field reporting
* Authority command center
* Maps/GIS
* GPS tracking
* Route optimization
* AI systems
* Notifications
* Analytics
* Delivery management
* Offline synchronization

These belong to future phases.

## Quality Principles

Prioritize:

1. Correctness
2. Usability
3. Responsive behavior
4. Maintainability
5. Visual polish

Avoid:

* Unnecessary dependencies
* Hard-coded credentials
* Fake production security
* Duplicate role definitions
* Unnecessary rewrites
* Generic template-like UI
* Placeholder functionality presented as real

## Responsive Principle

Desktop and mobile are both first-class experiences.

Do not treat mobile as a scaled-down desktop layout.

## Agent Rules

Before modifying code:

* Inspect the existing repository.
* Identify the framework and project structure.
* Identify existing components and design systems.
* Identify existing routing/authentication infrastructure.
* Reuse existing infrastructure where appropriate.
* Read this file and the current phase specification first.

Do not replace the existing technology stack without a strong technical reason.

## Documentation Rule

After every phase, record:

* What was implemented
* Important files changed
* Dependencies added
* Testing results
* Genuine limitations
* Starting point for the next phase
