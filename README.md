# Smart NER Logistics

Smart NER Logistics is a mobile-first logistics and accessibility intelligence platform being developed for Smart India Hackathon 2026, PS 26002.

## Current implementation

Phase 1 provides a unified role-selection and authentication flow. Phase 2 implements the connected Driver Core:

- Driver Home and responsive application shell
- Trip list, delivery details, guarded start/completion lifecycle
- Opt-in browser location foundation and operational route view
- Clearly labelled development route/disruption recommendations
- Alert center, Driver incident reporting, and an SOS intent flow
- Offline indicator, local report queue, profile/vehicle information, and delivery history

The Phase 2 experience uses development-only mock data stored locally in the browser. It has no production authentication backend, location transport service, AI/ML service, remote sync endpoint, media storage, or emergency-service integration. Those integration boundaries are deliberately separated from the UI for future implementation.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run lint
npm run build
```

## Project records

- Phase context and specifications: `/phase1` and `/phase 2`
- Completed task records: `/tasks/phase-01` and `/tasks/phase-02`
- Driver state and integration boundary: `/src/driver/DriverContext.tsx`

The project is developed phase by phase. Do not extend into Logistics Company, Field Officer, Authority, or full intelligence-platform workflows until their dedicated phase is active.
