# 5214 Jacana Lane - Real Estate Website PRD

## Original Problem Statement
Create a custom real estate website for 5214 Jacana Lane, San Jose, CA for agent George Toscano (GT Real). Harvard Crimson, White, Black, and Gold colors. Smart chatbot with property knowledge, Zillow photos, placeholder for drone footage (by Leon Mansalud), and a direct message/contact button.

## Charlotte Software Engineering Standards
- No Emergent branding anywhere. Tab shows business name.
- Frank Luntz "Words That Work" copywriting
- Mobile-first, responsive design
- Beautiful link previews (iMessage/SMS)
- Footer: "design by Charlotte."

## Tech Stack
- Frontend: React, Tailwind CSS, Shadcn UI
- Backend: FastAPI, Motor (async MongoDB)
- AI: OpenAI GPT-5.2 via Emergent LLM Key
- Architecture: Single-page app with monolithic App.js

## Completed Features (All Tested & Working)
1. Hero section with property details and CTAs
2. Property Details section (beds, baths, sqft, features)
3. Photo Gallery (Zillow images, bento grid)
4. Interactive Mortgage Calculator
5. Drone Footage placeholder (Coming Soon)
6. Agent Profile section (George Toscano headshot)
7. Gary Vee-style Marketing Materials (billboards, yard signs, flyers)
8. Zillow/Redfin links
9. Inline MP3 Music Player ("I Love U" by Stacy Kidd)
10. Multilingual AI Chatbot with voice input (6 languages)
11. Custom OG tags for iMessage/social previews
12. "design by Charlotte." footer credit
13. **Global Multilingual UI** - Flag bar at top with 6 languages (EN, ES, ZH, VI, FR, AR with Saudi Arabia flag). All page content translates instantly. Arabic supports RTL layout. Chatbot syncs with global language selection.

## Deployment Status
- Deployment check: PASSED
- All features tested and verified

## Backlog
- P1: Add actual drone footage when Leon Mansalud delivers it
- P2: Scheduling/booking form for house showings
- P3: Refactor App.js into smaller modular components
