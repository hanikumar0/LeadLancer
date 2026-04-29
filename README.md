# LeadLancer

**Tagline:** Find Clients. Close Deals. Grow Fast.

## Overview
LeadLancer is an automated freelancer lead generation platform that scrapes leads, scores them, facilitates outreach, and tracks deals.

## Tech Stack
- **Frontend Web:** Next.js App Router, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js, MongoDB, JWT Auth
- **Mobile:** React Native, Expo
- **Scraping Engine:** Playwright, Cheerio

## Engineering Principles
- Clean, modular, and scalable code.
- TypeScript strictly enforced where possible.
- Reusable UI components and responsive design.
- Security-first backend architecture.
- Optimized for speed and long-term maintainability.

## Proposed Architecture
The project will be structured as a monorepo to separate concerns while sharing types and configurations:

```text
/LeadLancer
  ├── /web          # Next.js App Router frontend
  ├── /mobile       # Expo React Native mobile application
  ├── /backend      # Express.js REST API and scraper services
  └── /shared       # (Optional) Shared TypeScript interfaces and utilities
```
