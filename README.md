# Better Practo — HCI Midsem Design Activity

**Course**: CS5015 — Human Computer Interaction  
**Student**: R. Abinav (ME23B1004)  
**Domain**: Online Doctor Consultation App (Practo)

## About

A **React + Tailwind CSS** prototype that identifies 14 usability violations in [Practo.com](https://www.practo.com) and solves each one using HCI principles from Lectures 1–8.

## Violations Identified & Solved

| V# | Practo Violation | HCI Principles | My Fix |
|----|-----------------|---------------|--------|
| V1 | Footer 50+ links | Miller's 7±2, Hick's, Tesler's | Collapsible footer, ≤7/group |
| V2 | Dual search bar | Tesler's, Zipf's, Asimov's 2nd | Unified search + auto-location |
| V3 | Cluttered doctor cards | Inverted Pyramid, Nielsen #8 | Progressive disclosure |
| V4 | No onboarding | Learnability, Power Law | 3-step guided tour |
| V5 | Weak booking feedback | Closure, Shneiderman #3/#4 | Progress bar + success animation |
| V6 | No contextual help | Nielsen #10, Shneiderman #8 | In-app searchable FAQ |
| V7 | Small secondary text | Accessibility, Observability | Min 14px, proper contrast |
| V8 | Inconsistent active nav | Nielsen #1, Shneiderman #1 | Consistent active indicators |
| V9 | Password fully masked | Password Masking case study | Show/hide toggle |
| V10 | Content not left-loaded | Horizontal Attention, F-Pattern | Left-aligned key content |
| V11 | Reset buttons on forms | Reset Must Die, Shneiderman #5 | No reset; individual clear |
| V12 | Alphabetical sort default | Alphabetical Must Die | Default: relevance/rating |
| V13 | Forced city selection | Asimov's 2nd, Zipf's | Auto-detect location |
| V14 | No booking progress bar | Closure, Synthesizability | 3-step indicator |

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Build**: Vite
- **Backend**: None (mock data)

## Getting Started

```bash
npm install
npm run dev
```

**Demo Credentials**: `user@betterpracto.com` / `password123`

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx        # V8: Consistent active nav
│   ├── Footer.jsx        # V1: Collapsible footer
│   └── Onboarding.jsx    # V4: 3-step guided tour
├── pages/
│   ├── Login.jsx         # V9: Password show/hide
│   ├── Home.jsx          # V2, V13: Unified search + auto-location
│   ├── Search.jsx        # V3, V12: Progressive disclosure + sort pills
│   ├── DoctorProfile.jsx # V3, V10: Clean layout + F-pattern
│   ├── Booking.jsx       # V5, V14, V11: Progress bar + no reset
│   └── Help.jsx          # V6: Searchable FAQ
├── data/doctors.js       # Mock data
├── App.jsx               # Routing + auth
├── main.jsx
└── index.css             # V7, V10: Global styles (min 14px, F-pattern)
submission/
└── me23b1004_cs5015_designActivity.tex  # LaTeX report
```
