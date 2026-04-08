# 5214 Chiconda Lane - Real Estate Website PRD

## Original Problem Statement
Create a custom real estate website for 5214 Chiconda Lane, San Jose, CA for agent George Toscano (GT Real). Harvard Crimson, White, Black, and Gold colors. Smart chatbot with property knowledge, Zillow photos, placeholder for drone footage (by Leon Mansalud), and a direct message/contact button.

## Charlotte Software Engineering Standards
- No Emergent branding anywhere. Tab shows business name.
- Frank Luntz "Words That Work" copywriting
- Mobile-first, responsive design
- Beautiful link previews (iMessage/SMS)
- Footer: "design by Charlotte."

## Tech Stack
- Frontend: React, Tailwind CSS, Shadcn UI
- Backend: FastAPI, Motor (async MongoDB)
- AI: OpenAI via Emergent LLM Key
- Object Storage: Emergent Object Storage (OG image)
- Architecture: Single-page app with monolithic App.js

## Completed Features
1. Hero section with actual property exterior photo and CTAs
2. Property Details section (beds, baths, sqft, features) - HOA $260/mo
3. Zillow Showcase link section (blue button → Zillow listing)
4. Open House section (Saturday & Sunday, 1:00 PM – 4:00 PM)
5. Drone Footage placeholder (Coming Soon)
6. Agent Profile section (George Toscano headshot)
7. Gary Vee-style Marketing Materials (billboards, yard signs, flyers)
8. Zillow/Redfin links
9. Inline MP3 Music Player
10. Multilingual AI Chatbot with voice input (6 languages)
11. Global Multilingual UI (EN, ES, ZH, VI, FR, AR with flag bar)
12. Custom 1200x1200 OG image tile for iMessage (stored in object storage)
13. "design by Charlotte." footer credit

## Recent Changes (April 2026)
- Price updated: $950,000 → $848,888
- Address updated: Jacana Lane → Chiconda Lane
- HOA updated: $255 → $260, removed utility/sewer line items
- Removed "Every Room Every Detail" gallery section (NAR compliance)
- Removed Mortgage Calculator, replaced with Zillow Showcase link
- Open House: Saturday & Sunday, 1:00 PM – 4:00 PM
- Year updated: 2025 → 2026

## Backlog
- P1: Add actual drone footage when Leon Mansalud delivers it
- P2: Scheduling/booking form for house showings
- P3: Refactor App.js into smaller modular components
